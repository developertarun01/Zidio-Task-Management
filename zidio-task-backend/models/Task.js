const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  subtasks: [{ type: String }],
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);