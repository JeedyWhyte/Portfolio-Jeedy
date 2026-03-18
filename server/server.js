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

// Restrict CORS to your actual frontend origin only.
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5500";
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman) only in development
    if (!origin && process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    if (origin === allowedOrigin) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Limit body size so no one can POST a huge payload to your DB
app.use(express.json({ limit: "10kb" }));

// Rate limiter (protects against spam)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 contact submissions per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please wait before trying again." },
});

app.use(globalLimiter);

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
app.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // Presence check
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  // Field length guards (also enforced at schema level)
  if (name.length > 100) {
    return res.status(400).json({ message: "Name must be 100 characters or fewer." });
  }
  if (email.length > 254) {
    return res.status(400).json({ message: "Email address is too long." });
  }
  if (message.length > 2000) {
    return res.status(400).json({ message: "Message must be 2000 characters or fewer." });
  }

  try {
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      data: newMessage,
    });
  } catch (err) {
    // Mongoose validation errors → 400, not 500
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: errors.join(". ") });
    }
    next(err);
  }
});

// ─── GET /messages ─────────────────────────────────────────────────────────────
// Returns all contact messages, newest first
app.get("/messages", (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  next();
}, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));