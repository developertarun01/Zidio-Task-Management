import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import apiClient from "../api/client"; // Updated import for configured axios instance
import { socket, initSocket } from '../utils/socket';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TaskPriorityChart = () => {
  const [taskData, setTaskData] = useState({ high: 0, medium: 0, low: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/tasks"); // Using configured apiClient
      const tasks = response.data;

      if (!Array.isArray(tasks)) {
        throw new Error("Invalid data format received");
      }

      const high = tasks.filter(task => task.priority === "High").length;
      const medium = tasks.filter(task => task.priority === "Medium").length;
      const low = tasks.filter(task => task.priority === "Low").length;

      setTaskData({ high, medium, low });
      setError(null);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setError(error.response?.data?.error || error.message);

      // Reset data on error
      setTaskData({ high: 0, medium: 0, low: 0 });

      // Handle unauthorized error
      if (error.response?.status === 401) {
        // Consider redirecting to login or showing auth message
        console.warn("Authentication required");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup socket listeners for real-time updates
    socket.on("taskAdded", fetchData);
    socket.on("taskUpdated", fetchData);
    socket.on("taskDeleted", fetchData);

    // Cleanup interval and socket listeners
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
      title: {
        display: true,
        text: "Task Priority Distribution",
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 } // Only show whole numbers
      },
    },
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md w-full max-w-md mt-6">
      <h2 className="text-xl font-semibold mb-4">📊 Task Priority Chart</h2>

      {loading ? (
        <div className="text-center py-4">Loading chart data...</div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded">
          {error.response?.status === 401
            ? "Please login to view task data"
            : `Error: ${error}`}
        </div>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default TaskPriorityChart;