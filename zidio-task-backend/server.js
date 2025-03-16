const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const authMiddleware = require("./middleware/authMiddleware"); // Middleware to protect routes

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://zidio-task-management-ruby.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' data:;");
  next();
});

app.use(bodyParser.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Protected Routes (Require authentication)
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/about", authMiddleware, aboutRoutes);

// MongoDB Connection Logging Fix
mongoose.connection.once("open", () => {
  console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
});
mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Connection Error: ${err.message}`);
});

// ✅ Export app for Vercel Deployment
module.exports = app;