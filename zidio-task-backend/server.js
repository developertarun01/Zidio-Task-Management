const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🔹 Enable CORS with Credentials Support
app.use(cors({
  origin: "https://zidio-task-management-ruby.vercel.app", // ✅ Removed trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  // ✅ Allows cookies & auth headers
}));

app.use(bodyParser.json()); // ✅ Middleware should be before routes

// 🔹 API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/about", aboutRoutes);

// 🔹 WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "https://zidio-task-management-ruby.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`🔗 Client connected: ${socket.id}`);

  socket.on("task-added", (task) => {
    console.log("📌 Task added:", task);
    io.emit("task-updated", task); // ✅ Notify all clients
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// 🔹 Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
