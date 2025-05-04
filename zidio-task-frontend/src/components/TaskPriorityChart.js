import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import socket from "../utils/socket";
import { color, motion } from "framer-motion";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const TaskPriorityChart = () => {
  const [taskData, setTaskData] = useState({ high: 0, medium: 0, low: 0 });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found for fetching tasks");
        return;
      }

      const response = await axios.get(
        "https://zidio-task-management-tanmoy9088.onrender.com/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const tasks = response.data;

      const high = tasks.filter((task) => task.priority === "High").length;
      const medium = tasks.filter((task) => task.priority === "Medium").length;
      const low = tasks.filter((task) => task.priority === "Low").length;

      setTaskData({ high, medium, low });
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("taskAdded", fetchData);
    socket.on("taskUpdated", fetchData);
    socket.on("taskDeleted", fetchData);

    return () => {
      socket.off("taskAdded", fetchData);
      socket.off("taskUpdated", fetchData);
      socket.off("taskDeleted", fetchData);
    };
  }, []);

  const chartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Count",
        data: [taskData.high, taskData.medium, taskData.low],
        backgroundColor: [
          "rgba(255, 77, 77, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(76, 175, 80, 0.8)",
        ],
        borderColor: ["#ff1f1f", "#ffc107", "#4caf50"],
        borderWidth: 4,
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "indigo",
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: " Live Task Priority Distribution",
        color: "gray",
        font: { size: 20 },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#eee",
      },
    },
    scales: {
      x: {
        ticks: { color: "black" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "black" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-neon rounded-2xl p-6 w-full h-full shadow-xl border border-white/10"
    >
      <h2 className="text-2xl font-semibold text-black mb-3 flex items-center gap-2">
        📊 Task Priority Chart
      </h2>

      <Bar data={chartData} options={chartOptions} />

      <div className="text-sm text-gray-500 mt-4 flex justify-between font-medium">
        <span>🔴 High: {taskData.high}</span>
        <span>🟡 Medium: {taskData.medium}</span>
        <span>🟢 Low: {taskData.low}</span>
      </div>
    </motion.div>
  );
};

export default TaskPriorityChart;
