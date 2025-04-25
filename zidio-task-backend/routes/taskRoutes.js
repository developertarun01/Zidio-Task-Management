const express = require("express");
const Task = require("../models/Task");
const User = require("../models/userModel");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
// const { io } = require("../server"); // Importing Socket.IO instance

const router = express.Router();

// ✅ Get Tasks (Admin sees all, Manager sees their created, User sees their assigned)
router.get("/", verifyToken, async (req, res) => {
  const { role, name, _id } = req.user;
  try {
    let tasks = [];

    if (role === "admin") {
      tasks = await Task.find({ deleted: false });
    } else if (role === "manager") {
      tasks = await Task.find({assignedTo: name, deleted: false });
    } else {
      tasks = await Task.find({ assignedTo: name, deleted: false });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ✅ Create Task (Admin only)
// In your backend route, verify the assigned user exists

// ✅ Create Task (Admin only)
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "manager"),
  async (req, res) => {
    try {
      console.log("Task Data Received:", req.body);

      // Destructure task data and assigned users from request body
      const { title, description, priority, deadline, dueTime, subtasks, status, assignedTo } = req.body;

      // Check if assignedTo is an array and has at least one user
      if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
        return res.status(400).json({ message: "At least one user must be assigned" });
      }

      // Find the users corresponding to the assignedTo usernames
      const userIds = await User.find({ username: { $in: assignedTo } }).select('_id');

      // If the number of found users does not match the requested ones, return an error
      if (userIds.length !== assignedTo.length) {
        return res.status(400).json({ message: "Some users not found" });
      }

      // Prepare task data with user IDs for assignedTo
      const taskData = {
        title,
        description,
        priority,
        deadline,
        dueTime,
        subtasks,
        status,
        assignedTo: userIds.map(user => user._id), // Store user IDs as an array
        createdBy: req.user.id, // Assuming you are storing the creator's ID
      };

      // Create and save the new task
      const newTask = new Task(taskData);
      await newTask.save();

      // ✅ Emit the task created event with the full task object (including assigned users)
      const io = req.app.get("io");
      if (io) {
        io.emit("taskCreated", newTask); // Correct event and object
      }
      console.log("Task Created:", newTask);

      // Send the created task as a response
      res.status(201).json(newTask);
    } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ message: "Failed to create task" });
    }
  }
);


// ✅ Update Task (Admin & Manager)
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "manager","employee"),
  async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          // runValidators: true,
        }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Emit event for real-time updates
      // Access io from request app context
      const io = req.app.get("io");
      if (io) {
        io.emit("taskUpdated", updatedTask);
      }
      console.log("Task Updated:", updatedTask); // ✅ Log updated task
      res.json(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err); // ✅ Log actual error
      res.status(500).json({ message: "Failed to update task" });
    }
  }
);

// ✅ Restore Task (Admin & Manager)
router.patch(
  "/restore/:id",
  verifyToken,
  allowRoles("admin", "manager"),
  async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { deleted: false },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Emit event for real-time updates
      // Access io from request app context
      const io = req.app.get("io");
      if (io) {
        io.emit("taskUpdated", task);
        console.log("Task Restored:", task); // ✅ Log restored task
      } // Emit 'taskRestored' to all connected clients

      res.json({ message: "Task restored", task });
    } catch (err) {
      res.status(500).json({ message: "Failed to restore task" });
    }
  }
);
// ✅ Soft Delete Task (Admin & Manager)
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "manager"),
  async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      });

      // Emit event for real-time updates
      // Access io from request app context
      const io = req.app.get("io");
      if (io) {
        io.emit("taskDeleted", task);
        console.log("Task Soft Deleted:", task); // ✅ Log soft deleted task  
      }
      res.json({ message: "Task moved to trash" });
    } catch (err) {
      res.status(500).json({ message: "Failed to soft delete task" });
    }
  }
);

// ✅ Permanent Delete Task (Admin only)
router.delete(
  "/permanent/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Emit event for real-time updates
      // Access io from request app context
      const io = req.app.get("io");
      if (io) {
        io.emit("taskPermanentlydeleted", task);
        console.log("Task Permanently Deleted:", task); // ✅ Log permanently deleted task  
      }
      res.json({ message: "Task permanently deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to permanently delete task" });
    }
  }
);

// ✅ Get Trashed Tasks (Admin & Manager)
router.get(
  "/trash",
  verifyToken,
  allowRoles("admin", "manager"),
  async (req, res) => {
    try {
      const trashedTasks = await Task.find({ deleted: true })
        .populate("deletedBy", "name email")
        .sort({
          deletedAt: -1,
        });
      res.json(trashedTasks);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch trashed tasks" });
    }
  }
);
// Example: GET /api/tasks/assigned-to-me
// router.get("/assigned-to-me", async (req, res) => {
//   try {
//     const username = req.user.name; // or from cookie/session
//     const tasks = await Task.find({ assignedTo: username });
//     const io = req.app.get("io");
//     if (io) {
//       io.emit("tasks", tasks);
//     }
//     res.json({ tasks });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching tasks" });
//   }
// });

module.exports = router;
