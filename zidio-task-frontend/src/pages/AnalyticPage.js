import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskPriorityChart from "../components/TaskPriorityChart"; // Chart for task priority
import RealtimeChart from "../components/RealTimeChart"; // Chart for real-time task updates
import TaskCompletionChart from "../components/TaskCompletionChart"; // Example chart for task completion rate
import OverdueTaskChart from "../components/OverdueTaskChart"; // Example chart for overdue tasks
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TaskStatusChart from "../components/TaskStatusChart";
import MonthlyTaskTrendsChart from "../components/MonthlyTaskTrendsChart";
import UserTaskLoadChart from "../components/UserTaskLoadChart";
import TaskPieChart from "../components/TaskPieChart"

const AnalyticsPage = () => {
  const [tasks, setTasks] = useState([]);
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
  }, []);

  return (
    <div className="flex flex-col bg-darkBg min-h-screen text-white font-sans">
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-cyan-300"
        >
          📊 Analytics Overview
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Task Priority Chart */}
          <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">
              Task Priority Distribution
            </h2>
            <TaskPriorityChart tasks={tasks} />
          </div>

          {/* Real-Time Chart */}
          <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">
              Real-Time Task Progress
            </h2>
            <RealtimeChart tasks={tasks} />
          </div>

          {/* Task Completion Chart */}
          {/* <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Task Completion Rate</h2>
            <TaskCompletionChart tasks={tasks} />
          </div> */}
          {/* Task Completion Chart */}
          {/* <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Task Completion Rate</h2>
            <TaskPieChart tasks={tasks} />
          </div> */}

          {/* Overdue Task Chart */}
          <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Overdue Tasks</h2>
            <OverdueTaskChart tasks={tasks} />
          </div>
          <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Task</h2>
            <UserTaskLoadChart tasks={tasks} />
          </div>
          {/* <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Tasks Status</h2>
            <TaskStatusChart tasks={tasks} />
          </div> */}
          <div className="bg-glass p-4 rounded-2xl shadow-glass border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Tasks Status</h2>
            <MonthlyTaskTrendsChart tasks={tasks} />
          </div>
        </div>
      </main>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AnalyticsPage;
