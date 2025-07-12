// Job data with icons
const jobList = [
  // Unskilled Category
  {
    name: "Welder",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-wrench",
    description: "Welders join metal parts together using heat or pressure.",
  },
  {
    name: "Watchman",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-shield-alt",
    description: "Watchmen are responsible for guarding premises.",
  },
  {
    name: "Works Keeper",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-toolbox",
    description: "Works keeper manages tools and equipment in the workplace.",
  },
  {
    name: "Creche Attendant",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-baby",
    description: "Creche attendants look after children in daycare settings.",
  },
  {
    name: "Waterman",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-tint",
    description:
      "Watermen are responsible for ensuring water distribution at a site.",
  },
  {
    name: "Petrol Loader",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-gas-pump",
    description:
      "Petrol loaders manage the loading and transportation of fuel.",
  },
  {
    name: "Wool Washers",
    category: "Unskilled",
    dailyWage: 378,
    icon: "fas fa-water",
    description: "Wool washers clean wool before it is processed.",
  },

  // Semi-skilled Category
  {
    name: "Semi-skilled Clerk",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-file-alt",
    description:
      "Clerks who perform duties that require some technical knowledge.",
  },
  {
    name: "Land Surveyor",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-ruler-combined",
    description: "Land surveyors measure and map the Earth's surface.",
  },
  {
    name: "Wireman",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-bolt",
    description: "Wiremen install and maintain electrical wiring systems.",
  },
  {
    name: "Head Dealer",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-user-tag",
    description: "Head dealers manage dealership operations.",
  },
  {
    name: "Assistant Carpenter",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-hammer",
    description:
      "Assistant carpenters help in construction work under a skilled carpenter.",
  },
  {
    name: "Tire Fitter",
    category: "Semi-skilled",
    dailyWage: 411,
    icon: "fas fa-tire",
    description: "Tire fitters remove and replace worn or damaged tires.",
  },

  // Skilled Category
  {
    name: "Mason",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-home",
    description: "Masons work with brick, stone, and concrete in construction.",
  },
  {
    name: "Blacksmith",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-fire",
    description: "Blacksmiths forge and shape metal items.",
  },
  {
    name: "Carpenter",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-hammer",
    description:
      "Carpenters construct, repair, and install building frameworks.",
  },
  {
    name: "Painter",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-paint-roller",
    description:
      "Painters apply paint, varnish, and other finishes to surfaces.",
  },
  {
    name: "Plumber",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-faucet",
    description:
      "Plumbers install and repair water, gas, and other piping systems.",
  },
  {
    name: "Typist",
    category: "Skilled",
    dailyWage: 464,
    icon: "fas fa-keyboard",
    description:
      "Typists are responsible for typing documents and managing text input.",
  },

  // Highly Skilled
  {
    name: "Accountant",
    category: "Highly Skilled",
    dailyWage: 514,
    icon: "fas fa-calculator",
    description: "Accountants handle financial records and transactions.",
  },
  {
    name: "Computer Operator",
    category: "Highly Skilled",
    dailyWage: 514,
    icon: "fas fa-laptop",
    description:
      "Computer operators manage and monitor computer systems and hardware.",
  },
  {
    name: "Pharmacist",
    category: "Highly Skilled",
    dailyWage: 514,
    icon: "fas fa-pills",
    description:
      "Pharmacists dispense prescription medications and provide healthcare advice.",
  },
  {
    name: "Lab Technician",
    category: "Highly Skilled",
    dailyWage: 514,
    icon: "fas fa-flask",
    description:
      "Lab technicians perform tests and procedures in a laboratory setting.",
  },
];

// Generate job cards on page load
document.addEventListener("DOMContentLoaded", function () {
  generateJobCards();

  // Set up event listeners
  document.getElementById("search-bar").addEventListener("input", searchJobs);
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document
    .getElementById("modal-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });
});

// Generate all job cards
function generateJobCards() {
  const categories = {
    Unskilled: document.querySelector('[data-category="Unskilled"] .grid'),
    "Semi-skilled": document.querySelector(
      '[data-category="Semi-skilled"] .grid'
    ),
    Skilled: document.querySelector('[data-category="Skilled"] .grid'),
    "Highly Skilled": document.querySelector(
      '[data-category="Highly Skilled"] .grid'
    ),
  };

  // Clear existing cards
  Object.values(categories).forEach((container) => {
    container.innerHTML = "";
  });

  // Add cards for each job
  jobList.forEach((job) => {
    const container = categories[job.category];
    if (container) {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-xl shadow-lg overflow-hidden card-hover-effect animate-fade-in";
      card.style.animationDelay = `${Math.random() * 0.3}s`;
      card.innerHTML = `
              <div class="p-6 text-center cursor-pointer" onclick="showJobDetails('${
                job.name
              }')">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-${
                  job.category === "Unskilled"
                    ? "gray"
                    : job.category === "Semi-skilled"
                    ? "teal"
                    : job.category === "Skilled"
                    ? "blue"
                    : "purple"
                }-500">
                  <i class="${job.icon}"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${
                  job.name
                }</h3>
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">${
                  job.description
                }</p>
                <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  job.category === "Unskilled"
                    ? "bg-gray-100 text-gray-800"
                    : job.category === "Semi-skilled"
                    ? "bg-teal-100 text-teal-800"
                    : job.category === "Skilled"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }">
                  ₹${job.dailyWage}/day
                </span>
              </div>
            `;
      container.appendChild(card);
    }
  });
}

// Show job details in modal
function showJobDetails(jobName) {
  const job = jobList.find((j) => j.name === jobName);
  if (!job) return;

  const dailyWage = job.dailyWage;
  const monthlyIncome = dailyWage * 26;
  const annualIncome = monthlyIncome * 12;
  const bonus = annualIncome * 0.0833;
  const totalAnnualIncome = annualIncome + bonus;

  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full ${
              job.category === "Unskilled"
                ? "bg-gray-200"
                : job.category === "Semi-skilled"
                ? "bg-teal-100"
                : job.category === "Skilled"
                ? "bg-blue-100"
                : "bg-purple-100"
            } flex items-center justify-center text-3xl ${
    job.category === "Unskilled"
      ? "text-gray-600"
      : job.category === "Semi-skilled"
      ? "text-teal-600"
      : job.category === "Skilled"
      ? "text-blue-600"
      : "text-purple-600"
  }">
              <i class="${job.icon}"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${job.name}</h2>
            <p class="text-gray-600 mb-6">${job.description}</p>
            
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Salary Details</h3>
              <div class="space-y-3 text-left">
                <div class="flex justify-between">
                  <span class="text-gray-600">Daily Wage:</span>
                  <span class="font-medium">₹${dailyWage.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Monthly Income (26 days):</span>
                  <span class="font-medium">₹${monthlyIncome.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Annual Income:</span>
                  <span class="font-medium">₹${annualIncome.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Bonus (8.33%):</span>
                  <span class="font-medium">₹${bonus.toFixed(2)}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-gray-200 mt-3">
                  <span class="text-gray-800 font-semibold">Total Annual Income:</span>
                  <span class="text-primary font-bold">₹${totalAnnualIncome.toFixed(
                    2
                  )}</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-center">
              <button onclick="closeModal()" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                Close
              </button>
            </div>
          </div>
        `;

  document.getElementById("modal-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

// Search functionality
function searchJobs() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const suggestionsList = document.getElementById("suggestions-list");

  // Clear previous suggestions
  suggestionsList.innerHTML = "";
  suggestionsList.classList.add("hidden");

  if (searchTerm.length < 2) return;

  // Filter jobs that match search term
  const matchedJobs = jobList
    .filter(
      (job) =>
        job.name.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5);

  if (matchedJobs.length > 0) {
    matchedJobs.forEach((job) => {
      const li = document.createElement("li");
      li.className =
        "px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center";
      li.innerHTML = `
              <i class="${job.icon} mr-3 ${
        job.category === "Unskilled"
          ? "text-gray-500"
          : job.category === "Semi-skilled"
          ? "text-teal-500"
          : job.category === "Skilled"
          ? "text-blue-500"
          : "text-purple-500"
      }"></i>
              <span>${highlightText(job.name, searchTerm)}</span>
              <span class="ml-auto text-sm text-gray-500">₹${
                job.dailyWage
              }/day</span>
            `;
      li.addEventListener("click", () => {
        document.getElementById("search-bar").value = job.name;
        suggestionsList.classList.add("hidden");
        showJobDetails(job.name);
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.classList.remove("hidden");
  }
}

// Highlight matching text in search results
function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(searchTerm, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
}

// Filter jobs by category
let activeFilters = [];
function toggleFilter(category) {
  const button = event.target.closest("button");

  if (activeFilters.includes(category)) {
    activeFilters = activeFilters.filter((item) => item !== category);
    button.classList.remove("ring-2", "ring-offset-2", "ring-white");
  } else {
    activeFilters.push(category);
    button.classList.add("ring-2", "ring-offset-2", "ring-white");
  }

  applyFilters();
}

// Apply active filters
function applyFilters() {
  const categories = document.querySelectorAll(".category");

  if (activeFilters.length === 0) {
    categories.forEach((cat) => cat.classList.remove("hidden"));
    return;
  }

  categories.forEach((cat) => {
    const categoryName = cat.getAttribute("data-category");
    if (activeFilters.includes(categoryName)) {
      cat.classList.remove("hidden");
    } else {
      cat.classList.add("hidden");
    }
  });
}
