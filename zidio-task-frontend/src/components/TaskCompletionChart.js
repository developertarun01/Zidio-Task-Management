import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import socket from "../utils/socket";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = () => {
  const [completionData, setCompletionData] = useState({
    overdue: 0,
    onTime: 0,
  });

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

        const overdue = tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status === "Completed"
        ).length;
        const onTime = tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) >= new Date() &&
            task.status === "Completed"
        ).length;

        setCompletionData({ overdue, onTime });
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
    labels: ["Overdue", "On-time"],
    datasets: [
      {
        data: [completionData.overdue, completionData.onTime],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderColor: ["#ef4444", "#22c55e"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "⏰ Overdue vs On-time Completion",
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
        Task Completion Analysis
      </h2>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default TaskCompletionChart;
