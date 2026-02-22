const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./messages.db");

db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter (protects against spam)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
});
app.use(limiter);

// API demo route
app.get("/api", (req, res) => {
    res.json({
        message: "Backend is running",
        developer: "Jerry-Bassey Bryan",
        skills: ["Node.js", "APIs", "Security", "Databases"],
    });
});

// Contact form route — validates input & saves to messages.txt
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    "INSERT INTO messages (name,email,message) VALUES (?,?,?)",
    [name, email, message],
    err => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Message saved successfully!" });
    }
  );
});

app.get("/messages", (req, res) => {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));