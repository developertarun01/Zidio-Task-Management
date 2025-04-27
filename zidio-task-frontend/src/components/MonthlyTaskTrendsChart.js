import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import socket from "../utils/socket";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const MonthlyTaskTrendsChart = () => {
  const [taskTrends, setTaskTrends] = useState([]);

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

        const trends = tasks.reduce((acc, task) => {
          const month = new Date(task.createdAt).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const months = Object.keys(trends);
        const counts = Object.values(trends);

        setTaskTrends({ months, counts });
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
    labels: taskTrends.months,
    datasets: [
      {
        label: "Tasks Created",
        data: taskTrends.counts,
        fill: false,
        backgroundColor: "#6b8e23",
        borderColor: "#6b8e23",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "📅 Monthly Task Trends",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="glass p-6 rounded-2xl shadow-xl border border-white/10 w-full max-w-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-md text-white">
      <h2 className="text-xl font-bold mb-4 text-lime-300">
        Monthly Task Trends
      </h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default MonthlyTaskTrendsChart;
