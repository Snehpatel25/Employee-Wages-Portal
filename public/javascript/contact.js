// --------------------
// Storage Manager with quota handling and encryption
// --------------------
class StorageManager {
  static VERSION = '1.1';
  static MAX_RETRIES = 2;
  static MAX_ITEM_SIZE = 1024 * 1024 * 1.5; // 1.5MB max per item

  static setItem(key, value, ttl = 3600000) {
    try {
      // Validate input
      if (typeof key !== 'string') {
        throw new Error('Key must be a string');
      }

      // Check data size before stringifying
      const testString = JSON.stringify(value);
      if (testString.length > this.MAX_ITEM_SIZE) {
        console.warn(`Data too large (${testString.length} bytes), truncating`);
        value = this._truncateData(value);
      }

      const data = {
        value: value,
        expiry: ttl ? Date.now() + ttl : null,
        version: this.VERSION,
        createdAt: Date.now()
      };

      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError' && this.MAX_RETRIES > 0) {
        console.warn('LocalStorage quota exceeded, cleaning old items');
        this.MAX_RETRIES--;
        this.cleanOldItems();
        return this.setItem(key, value, ttl); // Retry after cleanup
      }
      console.error('Storage error:', e);
      return false;
    }
  }

  static cleanOldItems() {
    const now = Date.now();
    Object.keys(localStorage).forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item || (item.expiry && item.expiry < now)) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    });
  }

  static getItem(key) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      
      // Validate item structure
      if (!item || typeof item !== 'object') {
        localStorage.removeItem(key);
        return null;
      }

      // Check expiry
      if (item.expiry && item.expiry < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value || null;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

  static clearAll() {
    localStorage.clear();
  }

  static getUsage() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      total += (key.length + localStorage.getItem(key).length) * 2;
    }
    return {
      usedBytes: total,
      quotaBytes: 5 * 1024 * 1024, // Standard 5MB quota
      percentUsed: Math.min(100, (total / (5 * 1024 * 1024)) * 100)
    };
  }

  static _truncateData(data, maxSize = this.MAX_ITEM_SIZE / 2) {
    if (typeof data === 'string') {
      return data.length > maxSize ? data.substring(0, maxSize) : data;
    }
    
    if (Array.isArray(data)) {
      return data.slice(0, Math.floor(maxSize / 100)); // Approx 100 bytes per array item
    }
    
    if (typeof data === 'object' && data !== null) {
      const truncated = {};
      for (const [k, v] of Object.entries(data)) {
        if (JSON.stringify(truncated).length < maxSize) {
          truncated[k] = this._truncateData(v, maxSize / Object.keys(data).length);
        }
      }
      return truncated;
    }
    
    return data;
  }
}

// --------------------
// DOM Elements Cache
// --------------------
const elements = {
  year: document.getElementById("current-year"),
  form: document.getElementById("contact-form"),
  nameInput: document.getElementById("name"),
  emailInput: document.getElementById("email"),
  messageInput: document.getElementById("message"),
  nameError: document.getElementById("name-error"),
  emailError: document.getElementById("email-error"),
  messageError: document.getElementById("message-error"),
  errorMessage: document.getElementById("error-message"),
  errorText: document.getElementById("error-text"),
  successMessage: document.getElementById("success-message"),
  submitBtn: document.getElementById("submit-btn"),
  btnText: document.getElementById("btn-text"),
  loadingSpinner: document.getElementById("loading-spinner")
};

// --------------------
// Initialize Page
// --------------------
function initPage() {
  // Set current year in footer
  elements.year.textContent = new Date().getFullYear();

  // Load draft if exists
  loadDraft();

  // Setup event listeners
  setupEventListeners();
}

// --------------------
// Enhanced email validation
// --------------------
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

// --------------------
// Form validation with debouncing
// --------------------
const validateForm = (() => {
  let timeout;
  return (name, email, message) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const nameValid = name.length >= 2 && name.length <= 50;
      const emailValid = validateEmail(email);
      const messageValid = message.length >= 10 && message.length <= 1000;

      elements.nameError.classList.toggle("hidden", nameValid);
      elements.emailError.classList.toggle("hidden", emailValid);
      elements.messageError.classList.toggle("hidden", messageValid);

      return nameValid && emailValid && messageValid;
    }, 300);
  };
})();

// --------------------
// Form submission handler
// --------------------
async function handleFormSubmit(event) {
  event.preventDefault();

  const name = elements.nameInput.value.trim();
  const email = elements.emailInput.value.trim();
  const message = elements.messageInput.value.trim();

  // Reset messages
  elements.errorMessage.classList.add("hidden");
  elements.successMessage.classList.add("hidden");

  // Validate form synchronously
  const nameValid = name.length >= 2 && name.length <= 50;
  const emailValid = validateEmail(email);
  const messageValid = message.length >= 10 && message.length <= 1000;

  elements.nameError.classList.toggle("hidden", nameValid);
  elements.emailError.classList.toggle("hidden", emailValid);
  elements.messageError.classList.toggle("hidden", messageValid);

  if (!nameValid || !emailValid || !messageValid) {
    elements.errorText.textContent = "Please correct the form errors";
    elements.errorMessage.classList.remove("hidden");
    return;
  }

  // Save draft
  StorageManager.setItem('draft_contact_form', { name, email, message });

  // Show loading state
  setLoadingState(true);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send message');
    }

    showSuccess("Message sent successfully!");
    elements.form.reset();
    localStorage.removeItem('draft_contact_form');
  } catch (error) {
    showError(error.message);
    console.error("Submission error:", error);
  } finally {
    setLoadingState(false);
  }
}

// --------------------
// Helper Functions
// --------------------
function setLoadingState(isLoading) {
  elements.submitBtn.disabled = isLoading;
  elements.btnText.textContent = isLoading ? "Sending..." : "Send Message";
  elements.loadingSpinner.classList.toggle("hidden", !isLoading);
}

function showError(message) {
  elements.errorText.textContent = message;
  elements.errorMessage.classList.remove("hidden");
}

function showSuccess(message) {
  elements.successMessage.querySelector('span').textContent = message;
  elements.successMessage.classList.remove("hidden");
  setTimeout(() => elements.successMessage.classList.add("hidden"), 5000);
}

function loadDraft() {
  const draft = StorageManager.getItem('draft_contact_form');
  if (draft) {
    elements.nameInput.value = draft.name || '';
    elements.emailInput.value = draft.email || '';
    elements.messageInput.value = draft.message || '';
  }
}

function setupEventListeners() {
  // Form submission
  elements.form.addEventListener("submit", handleFormSubmit);

  // Real-time validation
  ['name', 'email', 'message'].forEach(field => {
    document.getElementById(field).addEventListener('input', function() {
      validateForm(
        elements.nameInput.value.trim(),
        elements.emailInput.value.trim(),
        elements.messageInput.value.trim()
      );
    });
  });

  // Clear draft when navigating away if form is submitted
  window.addEventListener('beforeunload', () => {
    if (elements.successMessage.classList.contains("hidden")) {
      return;
    }
    localStorage.removeItem('draft_contact_form');
  });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);