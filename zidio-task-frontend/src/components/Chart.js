import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from "chart.js";
import {io} from "socket.io-client";
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
const socket = io("https://zidio-task-management-tanmoy9088.onrender.com/");

const Chart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();

    // ✅ Listen for new tasks added in real-time
    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const labels = tasks.map((task) => task.title);
    const progressData = tasks.map((task) => (task.status === 'completed' ? 100 : 0));

    setChartData({
      labels,
      datasets: [
        {
          label: "Completion Progress (%)",
          data: progressData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    });
  }, [tasks]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Progress Graph</h2>
      <div className="h-72 sm:h-96 md:h-72 lg:h-80 w-full">
        {chartData.labels.length > 0 ? <Line data={chartData} options={options} /> : <p className="text-gray-600 text-center">No data available.</p>}
      </div>
    </div>
  );
};

export default Chart;
