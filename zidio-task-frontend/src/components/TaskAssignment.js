import React, { useState, useContext } from "react";
import axios from "axios";
import socket from "../utils/socket";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useEffect, useRef } from "react";

// Optional: If you have user role stored in context
import { useAuth } from "../context/AuthContext";

const TaskAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // On page load, retrieve the role from localStorage and set it in context
  const role = localStorage.getItem("userRole");
  const user = localStorage.getItem("user")

  console.log("User:", user); // Log the role to make sure it's being fetched correctly
  console.log("User Role:", role); // Log the role to make sure it's being fetched correctly

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo.trim()) {
      toast.error("Please fill out required fields.");
      return;
    }

    const newTask = {
      title,
      description,
      priority,
      deadline,
      dueTime,
      subtasks,
      status: "pending",
      assignedTo,
    };

    try {
      const response = await axios.post(
        "http://localhost:4004/api/tasks",
        newTask,
        { withCredentials: true }
      );
      socket.emit("taskAdded", response.data);
      console.log("taskAdded", response.data);
      toast.success("Task Assigned Successfully 🎉");

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setDueTime("");
      setSubtasks([]);
      setSubtaskInput("");
      setAssignedTo("");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const fetchUsers = debounce(async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:4004/api/users/search?query=${query}`,
        {
          withCredentials: true,
        }
      );
      setUserOptions(res.data.users); // assuming users is returned
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, 300);

  useEffect(() => {
    if (assignedTo.trim()) {
      fetchUsers(assignedTo);
    } else {
      setShowDropdown(false);
    }
  }, [assignedTo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restrict to admin or manager only
  if (role !== "admin" && role !== "manager") {
    return (
      <div className="text-center text-red-500 font-bold p-6">
        You do not have permission to assign tasks.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl neon-glow text-white p-6 rounded-2xl w-full max-w-xl mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-cyan-200">
        🚀 Assign a New Task
      </h2>

      <form onSubmit={handleAddTask} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 h-24 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">✅ Low</option>
        </select>

        {/* Deadline and Time */}
        <div className="flex gap-4">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Subtask Input */}
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add subtask"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className="flex-grow p-2 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600 transition"
            >
              + Add
            </button>
          </div>

          <ul className="max-h-32 overflow-y-auto mt-2 space-y-1">
            {subtasks.map((subtask, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white/10 p-2 rounded-md"
              >
                {subtask}
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Assign To */}
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Assign to (username)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          {showDropdown && userOptions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 top-full left-0 w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto"
            >
              {userOptions.map((user, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-cyan-500/30 cursor-pointer text-white transition duration-200 rounded-lg"
                  onClick={() => {
                    setAssignedTo(user.username);
                    setShowDropdown(false);
                  }}
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition"
        >
          Assign Task
        </button>
      </form>
    </motion.div>
  );
};

export default TaskAssignment;


