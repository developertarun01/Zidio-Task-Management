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
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins for API & WebSocket
const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://zidio-task-management-ruby.vercel.app"
];

// ✅ CORS Middleware Fix
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ JSON Parser Middleware (Before Routes)
app.use(express.json());
app.use(bodyParser.json());

// ✅ WebSocket Configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ WebSocket Events
io.on("connection", (socket) => {
  console.log(`🟢 New WebSocket Connection: ${socket.id}`);

  socket.on("task-added", (task) => {
    console.log("Task Added:", task);
    io.emit("task-updated", task); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// ✅ Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Protected Routes (Require authentication)
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/about", authMiddleware, aboutRoutes);

// ✅ MongoDB Connection Logging
mongoose.connection.once("open", () => {
  console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
});
mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Connection Error: ${err.message}`);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
