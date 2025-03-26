import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { io } from "socket.io-client";

const socket =io("http://localhost:4004");

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TaskPriorityChart = () => {
  const [taskData, setTaskData] = useState({ high: 0, medium: 0, low: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4004/tasks"); // Fetch tasks from backend
        const tasks = response.data;

        const high = tasks.filter(task => task.priority === "High").length;
        const medium = tasks.filter(task => task.priority === "Medium").length;
        const low = tasks.filter(task => task.priority === "Low").length;

        setTaskData({ high, medium, low });
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 100); // Auto-refresh every 100 miliseconds for real-time updates

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Count",
        data: [taskData.high, taskData.medium, taskData.low],
        backgroundColor: ["#FF4D4D", "#FFC107", "#4CAF50"],
        borderColor: ["#B22222", "#FF9800", "#2E7D32"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Task Priority Distribution" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className=" p-5 bg-white rounded-lg shadow-md h-[292px] w-full max-w-md mt-6">
      <h2 className="text-xl font-semibold mb-4">📊 Task Priority Chart</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TaskPriorityChart;
