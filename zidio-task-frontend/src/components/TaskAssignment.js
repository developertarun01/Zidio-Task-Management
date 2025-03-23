import React, { useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4001");
const TaskAssignment = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title,
        priority,
        dueDate,
        dueTime,
        subtasks,
        deadline,
        completed: false,
      });
      setTitle("");
      setPriority("Medium");
      setDueDate("");
      setDueTime("");
      setSubtasks([""]);
      setDeadline("");
    }
    try {
      const response = await axios.post(
        "http://localhost:4001/tasks",
        onAddTask
      );
      socket.emit("taskAdded", response.data);
      setTitle("");
      setPriority("Medium");
      setDueDate("");
      setDueTime("");
      setSubtasks([]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="w-full bg-blue-50 rounded-lg p-4 shadow-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Task Assignment
        </h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-3"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {subtasks.map((subtask, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Subtask ${index + 1}`}
            value={subtask}
            onChange={(e) =>
              setSubtasks((prev) =>
                prev.map((s, i) => (i === index ? e.target.value : s))
              )
            }
            className="border px-4 py-2 rounded w-full mb-3 focus:ring-2 focus:ring-blue-400"
          />
        ))}

        <button
          type="button"
          onClick={() => setSubtasks([...subtasks, ""])}
          className="text-blue-600 mb-3"
        >
          + Add Subtask
        </button>

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mt-3 hover:bg-blue-500 transition-all"
        >
          <b>ADD TASK</b>
        </button>
      </form>
    </div>
  );
};

export default TaskAssignment;
