import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import TaskPriorityChart from "../components/TaskPriorityChart";
import RealtimeChart from "../components/RealTimeChart";
import Sidebar from "./Sidebar";
import TaskStats from "./Taskstats";
import socket from "../utils/socket";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

// Enable sending cookies with every request
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");

  const fetchTasks = async () => {
    try {
      const taskRes = await axios.get("http://localhost:4004/api/tasks", {
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
      const response = await fetch("http://localhost:4004/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        toast.success("Logout successful!");
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
    <div className="flex bg-darkBg min-h-screen text-white font-sans">
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-cyan-300"
          >
            🚀 Welcome {name}, to Zidio Dashboard
          </motion.h1>
          <div className="text-right text-sm">
            <div>
              <h2>Name: {name}</h2>
              <p>@email: {email}</p>
              <p className="text-red-200">Role: {role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-1 text-red-500 underline text-xs"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-black">
          <TaskAssignment />
          <TaskPriorityChart tasks={tasks} />
          <RealtimeChart tasks={tasks} />
        </div>

        <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
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
              className="px-3 py-1 rounded text-black"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1 rounded text-black"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-cyan-500 text-white px-4 py-1 rounded"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-pink-500 text-white px-4 py-1 rounded"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TaskList tasks={filteredTasks} />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
