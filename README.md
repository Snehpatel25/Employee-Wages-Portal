# Employee Wages Portal

The **Employee Wages Portal** is a secure full-stack web application built with **Node.js**, **Express**, and **MongoDB**.
It helps manage and display government worker wage details across multiple states (**Gujarat**, **Madhya Pradesh**, and **Rajasthan**) with secure contact form submission.

---

## ✨ Features

- Display wage details for skilled, semi-skilled, and unskilled workers
- Manage required worker counts and bonus calculations
- Secure contact form with validation and MongoDB storage
- Basic security with Helmet, CORS, and rate limiting
- Organized static pages with caching
- Easily customizable and extendable

---

## 📁 Project Structure

Employee_Wages_Portal/
│
├── public/               # Static HTML, CSS, JS files
│   ├── home.html
│   ├── pages/
│   │   └── contact.html
│   └── ...
├── .gitignore
├── server.js             # Express server setup
├── package.json
├── README.md
└── .env                  # Your environment variables (do not commit)

---

## ⚙️ How to Run Locally

1. Clone the repo:
   git clone https://github.com/Snehpatel25/Employee-Wages-Portal.git
   cd Employee-Wages-Portal

2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a .env file with:
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string

4. Start the server:
   npm start
   or
   node server.js

5. Open http://localhost:3000 in your browser.

---

## 🔒 Security & Best Practices

✅ Helmet for secure HTTP headers
✅ CORS for cross-origin security
✅ Express Rate Limiting to prevent abuse
✅ Proper .gitignore to exclude node_modules and .env
✅ Basic MongoDB schema validation

---

## 🙌 Contributions

Feel free to fork, customize, and improve this project.
Pull requests are welcome!

---

## 📜 License

This project is open-source for learning and development purposes.

---

**Made with ❤️ by Sneh Patel**
