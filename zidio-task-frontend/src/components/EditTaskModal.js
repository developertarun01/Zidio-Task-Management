import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    deadline: "",
    assignedTo: [],
  });
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user || (user.role !== "admin" && user.role !== "manager")) {
      toast.error("❌ Unauthorized: Only admins or managers can edit tasks.");
      onClose();
      return;
    }
    setUserRole(user.role);
  }, [onClose]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        assignedTo: Array.isArray(task.assignedTo)
          ? task.assignedTo
          : task.assignedTo
          ? [task.assignedTo]
          : [],
        deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      });
    }
  }, [task]);

  useEffect(() => {
    if (userRole === "admin" || userRole === "manager") {
      axios
        .get("https://zidio-task-management-tanmoy9088.vercel.app/api/auth/users", { withCredentials: true })
        .then((res) => setUsers(res.data))
        .catch((err) => {
          console.error("Failed to fetch users:", err);
          toast.error("⚠️ Failed to load users");
        });
    }
  }, [userRole]);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    if (name === "assignedTo") {
      const selectedValues = Array.from(selectedOptions).map(
        (opt) => opt.value
      );
      setFormData((prev) => ({
        ...prev,
        assignedTo: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.warning("⚠️ Title is required");
      return;
    }

    try {
      await axios.put(`https://zidio-task-management-tanmoy9088.vercel.app/api/tasks/${task._id}`, formData, {
        withCredentials: true,
      });

      toast.success("✅ Task updated successfully!");
      onSave(task._id, formData);
      onClose();
    } catch (error) {
      console.error(
        "❌ Error updating task:",
        error.response?.data || error.message
      );
      toast.error(
        "❌ Failed to update task: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  if (!isOpen || !task || (userRole !== "admin" && userRole !== "manager"))
    return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl w-full max-w-md text-white"
          >
            <h2 className="text-2xl font-semibold mb-5 text-cyan-300">
              Edit Task
            </h2>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Title"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Description"
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟠 Medium</option>
              <option value="High">🔴 High</option>
            </select>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <select
              multiple
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 h-64 overflow-auto"
            >
              <option value="">👤 Assign to...</option>
              {users.map((u) => (
                <option
                  className="text-gray-700"
                  key={u._id}
                  value={u.username}
                >
                  {u.name || u.username} ({u.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 rounded-lg text-white shadow-md hover:shadow-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-cyan-400/30 transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;
