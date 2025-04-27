import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { io } from "socket.io-client";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
const socket = io("https://zidio-task-management-tanmoy9088.onrender.com");

const ProgressChart = () => {
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Progress Chart
        </h2>
        <p className="text-gray-600">No tasks available to display progress.</p>
      </div>
    );
  }

  const data = {
    labels: tasks.map((task) => task.title),
    datasets: [
      {
        label: "Task Progress (%)",
        data: tasks.map((task) => (task.status === "completed" ? 100 : 0)),
        backgroundColor: tasks.map((task) =>
          (task.progress === 100 ? "Green" : "")
        ),
      },
    ],
  };

  return (
    <div className="w-full p-2 mt-6 pb-20 bg-white shadow-lg rounded-lg max-h-[400px]">
      <h2 className="text-xl font-bold mb-4 text-center">
        Task Progress Overview
      </h2>
      <Bar
        data={data}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default ProgressChart;
