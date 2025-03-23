const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a task
router.post("/", authMiddleware, async (req, res) => {
  const { title, priority, subtasks, deadline } = req.body;
  const task = new Task({
    title,
    priority,
    subtasks,
    deadline,
    userId: req.user.id,
  }); // Getting userId from the token

  try {
     await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
