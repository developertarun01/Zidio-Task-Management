const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "https://zidio-task-management-ruby.vercel.app", // ✅ Set specific frontend URL
    credentials: true, // ✅ Allow cookies/auth
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow required methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
  })
);

app.use(express.json());

// ✅ **Handle Preflight Requests**
app.options("*", cors(corsOptions));

const io = require("socket.io")(server, {
  cors: {
    origin: "https://zidio-task-management-ruby.vercel.app", // ✅ Allow frontend
    credentials: true, // ✅ Allow authentication
  },
});


io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("task-added", (task) => {
    io.emit("task-updated", task);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ✅ **API Routes**
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));