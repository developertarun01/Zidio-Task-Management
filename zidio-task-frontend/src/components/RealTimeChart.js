import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { io } from "socket.io-client";
import axios from "axios";

// Register chart components
Chart.register(ArcElement, Tooltip, Legend);
const socket = io("https://zidio-task-management-tanmoy9088.onrender.com/");

const RealTimeChart = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

    // Real-time updates
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

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.length - completed;

  const total = tasks.length || 1; // prevent division by 0
  const completedPercent = ((completed / total) * 100).toFixed(1);
  const pendingPercent = ((pending / total) * 100).toFixed(1);

  const data = {
    labels: [
      `✅ Completed (${completedPercent}%)`,
      `🕒 Pending (${pendingPercent}%)`,
    ],
    datasets: [
      {
        label: "Task Breakdown",
        data: [completed, pending],
        backgroundColor: ["#4CAF50", "#FFC107"],
        borderColor: ["#388E3C", "#FFA000"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    animation: {
      animateRotate: true,
      duration: 1200,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const label = ctx.label || "";
            const value = ctx.parsed;
            return `${label}: ${value} task${value !== 1 ? "s" : ""}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg w-full  transition-all duration-300 hover:scale-[1.02]">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        📊 Real-Time Task Progress
      </h2>
      <div className="relative h-52">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          ✅ <strong>{completed}</strong> completed • 🕒{" "}
          <strong>{pending}</strong> pending
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Total: <strong>{tasks.length}</strong> task
          {tasks.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default RealTimeChart;
