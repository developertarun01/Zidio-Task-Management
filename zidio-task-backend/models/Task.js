const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  subtasks: [{ type: String }],
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // ✅ Added status field
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linking with user
});

module.exports = mongoose.model("Task", taskSchema);
