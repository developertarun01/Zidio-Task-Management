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

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const UserTaskLoadChart = () => {
  const [userTasks, setUserTasks] = useState([]);

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

        const userTaskCount = tasks.reduce((acc, task) => {
          acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
          return acc;
        }, {});

        setUserTasks(Object.entries(userTaskCount));
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
    labels: userTasks.map(([user]) => user),
    datasets: [
      {
        label: "Task Load",
        data: userTasks.map(([, count]) => count),
        backgroundColor: "#9333ea",
        borderColor: "#9333ea",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "🧑‍💻 User-wise Task Load",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="glass p-6 rounded-2xl shadow-xl border border-white/10 w-full max-w-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-md text-white">
      <h2 className="text-xl font-bold mb-4 text-lime-300">User Task Load</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserTaskLoadChart;
