const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://zidio-task-management-ruby.vercel.app",
];

// **Fix 1: CORS Middleware**
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// **Fix 2: Proper Headers**
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/about", aboutRoutes);

// **Fix 3: Socket.io CORS Handling**
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
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

// **Fix 4: Handle Preflight Requests**
app.options("*", cors(corsOptions));

// **Fix 5: Global Error Handling**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// **Fix 6: Start Server**
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
