const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const userRoutes = require("./routes/userRoutes");
const meetingsRoute = require("./routes/meeting");
// import teamRoutes from "./routes/teamRoutes.js";
const Feedback = require("./models/feedback");
const Task = require("./models/Task");
const verifyToken = require("./middleware/authMiddleware");
const socketIo = require("socket.io");
dotenv.config();
connectDB();

const app = express();
// ✅ Fix: CORS must be set properly
// setup cors options
const corsOptions = {
  origin: "https://zidio-task-management-tanmoy9088.vercel.app",
  credentials: true, // allow cookies, authorization headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};



const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://zidio-task-management-tanmoy9088.vercel.app", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});
// use cors with options
app.use(cors(corsOptions));

// Also handle preflight requests manually if needed
app.options("*", cors(corsOptions));

//Body Parsers middleware
app.use(express.json());
app.set("io", io); // Make io available in routes
app.use(cookieParser());
app.use(bodyParser.json());


// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use("/api/meetings", meetingsRoute);
// app.use("/api/team", teamRoutes);

cron.schedule("0 0 * * *", async () => {
  const daysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await Task.deleteMany({
    deleted: true,
    deletedAt: { $lte: daysAgo },
  });
  console.log(`🧹 Auto-cleaned ${result.deletedCount} tasks from trash`);
});

// 📩 Email Notification Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

const sendEmailNotification = (email, task) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Task Reminder",
    text: `Reminder: Your task "${task}" is due soon!`,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) console.error("Email not sent", error);
  });
};

app.post("/send-reminder", (req, res) => {
  const { email, task } = req.body;
  sendEmailNotification(email, task);
  res.json({ message: "Email Reminder Sent" });
});

// 📌 Notification via Socket.IO
const sendNotification = (message) => {
  io.emit("notification", message);
};

app.post("/update-task", (req, res) => {
  const { taskName, status } = req.body;
  sendNotification(`Task "${taskName}" was marked as ${status}`);
  res.json({ message: "Notification Sent" });
});

// 📥 Submit Feedback
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    io.emit("newFeedback", newFeedback);
    res
      .status(201)
      .json({ message: "Feedback submitted", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ error: "Error submitting feedback" });
  }
});

// 📊 Analytics
app.get("/tasks/filter/:priority", async (req, res) => {
  try {
    const tasks = await Task.find({ priority: req.params.priority });
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/tasks/progress/:timeframe", async (req, res) => {
  try {
    let dateRange;
    const now = new Date();
    if (req.params.timeframe === "daily") {
      dateRange = new Date(now.setDate(now.getDate() - 1));
    } else if (req.params.timeframe === "weekly") {
      dateRange = new Date(now.setDate(now.getDate() - 7));
    } else if (req.params.timeframe === "monthly") {
      dateRange = new Date(now.setMonth(now.getMonth() - 1));
    }

    const tasks = await Task.find({
      status: "Completed",
      createdAt: { $gte: dateRange },
    });

    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
});

// 📦 Real-time Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 👉 Handle 404 (no route matched)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// 👉 Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({ message: "Internal Server Error" });
});
