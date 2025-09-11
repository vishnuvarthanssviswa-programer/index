const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File storage (uploads/)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- Dummy student & faculty data ---
const students = [{ id: "12345", password: "student123", name: "Vishnu" }];
const faculty = [{ id: "f001", password: "faculty123", name: "Dr. Kumar" }];

// --- Routes ---
// Student login
app.post("/api/student/login", (req, res) => {
  const { id, password } = req.body;
  const student = students.find(s => s.id === id && s.password === password);
  if (student) {
    res.json({ success: true, message: "Login successful", name: student.name });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Faculty login
app.post("/api/faculty/login", (req, res) => {
  const { id, password } = req.body;
  const f = faculty.find(f => f.id === id && f.password === password);
  if (f) {
    res.json({ success: true, message: "Welcome Faculty", name: f.name });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Document upload
app.post("/api/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, message: "File uploaded", file: req.file.filename });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
