require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ✅ Helmet with CSP for Tailwind + CDN
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com"
        ],
        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com"
        ]
      }
    }
  })
);

// ✅ CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// ✅ Serve static files with cache
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  })
);

// ✅ MongoDB connection with debug logs
const connectDB = async (retries = 3, delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/EmployeePortalDB', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error(`❌ MongoDB connection error (${retries} retries left):`, err);
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(retries - 1, delay * 1.5);
    }
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => console.log('✅ Mongoose connected!'));
mongoose.connection.on('disconnected', () => console.log('❌ Mongoose disconnected!'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose error:', err));

// ✅ Contact schema + model
const contactSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message should be at least 10 characters long'],
    maxlength: [5000, 'Message cannot be more than 5000 characters']
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'spam'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

contactSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

// ✅ Serve file helper with subfolder support
const serveFile = (fileName, subfolder = '') => async (req, res) => {
  const filePath = path.join(__dirname, 'public', subfolder, fileName);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    res.sendFile(filePath, (err) => {
      if (err && !res.headersSent) {
        console.error(`Error serving ${filePath}:`, err);
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
      }
    });
  } catch (err) {
    console.error(`File not found: ${filePath}`);
    if (!res.headersSent) {
      res.sendFile(path.join(__dirname, 'public', 'home.html'));
    }
  }
};

// ✅ Routes
app.get('/', serveFile('home.html'));
app.get('/contact', serveFile('contact.html', 'pages')); // from public/pages

// ✅ API endpoint with save debug
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('✅ Received contact:', { name, email, subject, message });

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });

    await newContact.save();
    console.log('✅ Contact saved to DB:', newContact);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      contactId: newContact._id
    });
  } catch (error) {
    console.error('❌ Contact submission error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        errors: Object.values(error.errors).map((val) => val.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Fallback for unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ✅ Start server
(async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });
})();
