// Import dependencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const URI =
  "mongodb+srv://tanmoyd9088:<db_password>@cluster0.w1zey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define User schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Define Task schema
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  userId: mongoose.Schema.Types.ObjectId,
});
const Task = mongoose.model("Task", TaskSchema);

// User Registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.userId = decoded.userId;
    next();
  });
};

// CRUD operations for tasks
app.post("/tasks", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, userId: req.userId });
  await task.save();
  res.json(task);
});

app.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

app.put("/tasks/:id", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, status },
    { new: true }
  );
  res.json(task);
});

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
