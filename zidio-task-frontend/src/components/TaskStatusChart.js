import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import socket from "../utils/socket";

ChartJS.register(ArcElement, CategoryScale, Tooltip, Legend);

const TaskStatusChart = () => {
  const [statusData, setStatusData] = useState({ pending: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data;

        const pending = tasks.filter(task => task.status === "Pending").length;
        const completed = tasks.filter(task => task.status === "Completed").length;

        setStatusData({ pending, completed });
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

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
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [statusData.pending, statusData.completed],
        backgroundColor: ["#f59e0b", "#10b981"],
        borderColor: ["#f59e0b", "#10b981"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "✅ Task Status Breakdown",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="glass p-6 rounded-2xl shadow-xl border border-white/10 w-full max-w-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-md text-white">
      <h2 className="text-xl font-bold mb-4 text-lime-300">Task Status Distribution</h2>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default TaskStatusChart;
