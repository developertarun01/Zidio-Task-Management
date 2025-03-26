const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const Feedback = require("./models/feedback");
const Task = require("./models/Task");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const corsOptions = {
  origin: "https://zidio-task-management-ruby.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Update Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: [
      "https://zidio-task-management-ruby.vercel.app",
      "http://localhost:3000" // For local development
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/api/socket.io" // Ensure this matches frontend
});

// API Routes with consistent /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/tasks", taskRoutes); // Now using the routes file
app.use("/api/about", aboutRoutes);

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Task API Endpoints (now properly prefixed with /api)
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    io.emit("taskAdded", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { status, progress } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status, progress },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    io.emit("taskUpdated", updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    io.emit("taskDeleted", task._id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

app.get("/api/tasks/filter/:priority", async (req, res) => {
  try {
    const tasks = await Task.find({ priority: req.params.priority });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/api/tasks/progress/:timeframe", async (req, res) => {
  try {
    let dateRange;
    const now = new Date();

    switch (req.params.timeframe) {
      case "daily":
        dateRange = new Date(now.setDate(now.getDate() - 1));
        break;
      case "weekly":
        dateRange = new Date(now.setDate(now.getDate() - 7));
        break;
      case "monthly":
        dateRange = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return res.status(400).json({ error: "Invalid timeframe" });
    }

    const tasks = await Task.find({
      status: "Completed",
      createdAt: { $gte: dateRange },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Feedback Endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    io.emit("newFeedback", newFeedback);
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    res.status(500).json({ error: "Error submitting feedback" });
  }
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// 404 Handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});