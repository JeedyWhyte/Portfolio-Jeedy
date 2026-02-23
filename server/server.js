require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/database");
const Message = require("./models/message.m");

// Connect to MongoDB
connectDB();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter (protects against spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
});
app.use(limiter);

// ─── API Demo Route ────────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    message: "Backend is running",
    developer: "Jerry-Bassey Bryan",
    skills: ["Node.js", "APIs", "Security", "Databases"],
  });
});

// ─── POST /contact ─────────────────────────────────────────────────────────────
// Validates input and saves a new contact message to MongoDB
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /messages ─────────────────────────────────────────────────────────────
// Returns all contact messages, newest first
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));