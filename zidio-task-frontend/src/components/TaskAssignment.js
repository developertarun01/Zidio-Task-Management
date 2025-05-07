import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../utils/socket";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

const TaskAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [assignedTo, setAssignedTo] = useState([]); // Change to an array
  const [assigneeInput, setAssigneeInput] = useState(""); // Input text for live search
  const [userOptions, setUserOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const role = localStorage.getItem("userRole");
  const user = localStorage.getItem("user");

  console.log("User:", user);
  console.log("User Role:", role);

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
    if (!title.trim() || assignedTo.length === 0) {
      // Check if at least one user is assigned
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
      assignedTo, // Now an array of usernames or user IDs
    };

    try {
      const response = await axios.post(
        "https://zidio-task-management-tanmoy9088.onrender.com/api/tasks",
        newTask,
        { withCredentials: true }
      );
      socket.emit("taskAdded", response.data);
      toast.success("Task Assigned Successfully 🎉");

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setDueTime("");
      setSubtasks([]);
      setSubtaskInput("");
      setAssignedTo([]); // Reset assigned users array
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const fetchUsers = debounce(async (query) => {
    try {
      const res = await axios.get(
        `https://zidio-task-management-tanmoy9088.onrender.com/api/users/search?query=${query}`,
        { withCredentials: true }
      );
      setUserOptions(Array.isArray(res.data.users) ? res.data.users : []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUserOptions([]); // fallback
    }
  }, 300);

  useEffect(() => {
    if (assigneeInput.trim()) {
      fetchUsers(assigneeInput);
    } else {
      setUserOptions([]);
      setShowDropdown(false);
    }
  }, [assigneeInput]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAssignedUser = (user) => {
    if (!assignedTo.includes(user.username)) {
      setAssignedTo([...assignedTo, user.username]);
    }
    setAssigneeInput(""); // Clear the input box
    setUserOptions([]);
    setShowDropdown(false);
  };

  const handleRemoveAssignedUser = (username) => {
    setAssignedTo(assignedTo.filter((user) => user !== username)); // Remove user from assigned list
  };

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
      className="bg-gradient-to-br from-[#042330] via-[#214753] to-[#06041e] backdrop-blur-md border border-white/30 shadow-xl neon-glow text-white p-16 px-48 rounded-2xl w-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-cyan-200">
        🚀 Assign a New Task
      </h2>

      <form onSubmit={handleAddTask} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 h-24 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full text-gray-400 p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">✅ Low</option>
        </select>

        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
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

        <div>
          <div className="flex gap-2 flex-wrap">
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

        <div className="relative" ref={dropdownRef}>
          <div className="flex flex-wrap gap-2 mb-2">
            {assignedTo.map((username) => (
              <span
                key={username}
                className="flex items-center gap-1 bg-cyan-600/50 px-2 py-1 rounded-full text-sm"
              >
                {username}
                <button
                  type="button"
                  onClick={() => handleRemoveAssignedUser(username)}
                  className="text-white hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search users to assign"
            value={assigneeInput}
            onChange={(e) => {
              setAssigneeInput(e.target.value);
              fetchUsers(e.target.value); // Fetch as user types
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {showDropdown && userOptions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 top-full left-0 w-full bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto"
            >
              {userOptions.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-cyan-500/30 cursor-pointer text-blue-100 transition duration-200 rounded-lg"
                  onClick={() => handleAddAssignedUser(user)}
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

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
