const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Feedback = require(".models/FeedbackModel");
const taskRoutes = require("./routes/taskRoutes");
const aboutRoutes = require("./routes/aboutRoutes"); // Import About Routes

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://zidio-task-management-ruby.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Ensure both are allowed
});

app.use(bodyParser.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/about", aboutRoutes); // Add About API Route

// Submit feedback
app.post('/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newFeedback = new Feedback({ name, email, message });

    await newFeedback.save();
    
    // Emit real-time update
    io.emit('newFeedback', newFeedback);
    console.log(newFeedback);
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });

  } catch (error) {
    res.status(500).json({ error: 'Error submitting feedback' });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("task-added", (task) => {
    io.emit("task-updated", task);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
