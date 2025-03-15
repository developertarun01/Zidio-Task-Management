const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://zidio-task-management-ruby.vercel.app",
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "https://zidio-task-management-ruby.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("task-added", (task) => {
    io.emit("task-updated", task);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/api/tasks", (req, res) => {
  res.json([]); // Dummy data, replace with DB call
});

server.listen(5000, () => console.log("Server running on port 5000"));