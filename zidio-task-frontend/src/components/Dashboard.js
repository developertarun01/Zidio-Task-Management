import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import TaskPriorityChart from "../components/TaskPriorityChart";
import RealtimeChart from "../components/RealTimeChart";
import StatusBreakdownChart from "./StatusBreakdownchart";
import Sidebar from "./Sidebar";
import TaskStats from "./Taskstats";
import socket from "../utils/socket";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { useTheme } from "../context/ThemeContext";

// Enable sending cookies with every request
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");
  const { darkMode, toggleDarkMode } = useTheme();

  const fetchTasks = async () => {
    try {
      const taskRes = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks", {
        withCredentials: true,
      });
      const allTasks = taskRes.data;

      let visibleTasks = [];
      if (role === "admin") {
        visibleTasks = allTasks;
      } else {
        visibleTasks = allTasks.filter((task) => task.assignedTo === name);
      }

      setTasks(visibleTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Failed to fetch tasks. Please login again.");
      }
    }
  };

  useEffect(() => {
    fetchTasks();

    // Listen for live task updates from socket
    socket.on("taskAdded", (newTask) => setTasks((prev) => [...prev, newTask]));
    socket.on("taskUpdated", (updatedTask) =>
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      )
    );
    socket.on("taskDeleted", (taskId) =>
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
    );

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const matchesStatus =
      filter === "all" ||
      (filter === "completed" && task.status === "completed") ||
      (filter === "pending" && task.status === "pending") ||
      (filter === "overdue" && deadline < now && task.status !== "completed") ||
      (filter === "upcoming" &&
        deadline > now &&
        deadline - now < 7 * 24 * 60 * 60 * 1000);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleLogout = async () => {
    try {
      const response = await fetch("https://zidio-task-management-tanmoy9088.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logout successful!");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error("Logout failed");
        console.error("Logout failed:", await response.json());
      }
    } catch (err) {
      toast.error("Network error while logging out");
      console.error("Logout error:", err);
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(tasks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tasks.csv");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Tasks", 10, 10);
    const taskRows = tasks.map((task) => [
      task.title,
      task.priority,
      task.status,
      new Date(task.deadline).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["Title", "Priority", "Status", "Deadline"]],
      body: taskRows,
    });
    doc.save("tasks.pdf");
  };

  return (
    <div className="flex bg-gradient-to-br from-[#042330] via-[#214753] to-[#06041e] min-h-screen font-sans bg-white dark:bg-gray-900 text-black dark:text-white">
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-start"
        >
          {/* <div
            className={` ${
              darkMode ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            <header
              className={`p-4 ${darkMode ? "bg-gray-900" : "bg-white"} shadow`}
            >
              Welcome back!
            </header> */}
          {/* Content */}
          {/* </div> */}

          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 animate-gradient">
               Welcome back! {name}, to Zidio Dashboard
            </h1>
          </div>
          <div className="text-white bg-gradient-to-r from-black via-indigo-800 to-blue-700 animate-gradient p-4 rounded-lg shadow-md text-sm backdrop-blur-md space-y-2">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p className="text-red-200">
              <strong>Role:</strong> {role}
            </p>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="mt-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Logout
            </button>
            <LogoutConfirmModal
              open={showLogoutModal}
              setOpen={setShowLogoutModal}
              onConfirm={handleLogout}
            />
          </div>
        </motion.div>

        {/* Animated Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-4 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <div className="w-full h-full max-w-full max-h-full">
              <TaskPriorityChart tasks={tasks} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-200 via-teal-200 to-cyan-200 p-4 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <div className="w-full h-full max-w-full max-h-full">
              <RealtimeChart tasks={tasks} />
            </div>
          </div>

          <div className="col-span-2 md:col-span-2 gap-2 bg-gradient-to-br from-yellow-100 via-pink-100 to-rose-100 p-4 rounded-xl shadow-lg flex items-center justify-center overflow-auto">
            <div className="">
              <StatusBreakdownChart tasks={tasks} />
            </div>
          </div>
        </motion.div>

        {/* Task assignment + filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md space-y-4"
        >
          <TaskAssignment />
        </motion.div>

        {/* Task Stats and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden"
        >
          <TaskStats
            tasks={tasks}
            onFilterSelect={setFilter}
            selectedFilter={filter}
          />
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-md bg-white text-black shadow-inner"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-md bg-white text-black shadow-inner"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
            >
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* Task List Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-md"
        >
          <TaskList tasks={filteredTasks} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
