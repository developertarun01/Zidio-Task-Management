
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { io } from "socket.io-client";
// import socket from "../utils/socket";
import axios from "axios";
// Register necessary Chart.js components
Chart.register(ArcElement, Tooltip, Legend);
 const socket = io("http://localhost:4004");

const RealTimeChart = () => {
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
      const response = await axios.get("http://localhost:4004/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.length - completedTasks;

  const data = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Progress",
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#4CAF50", "#FFC107"],
      },
    ],
  };
  return (
    <div className="bg-white pt-2 shadow-md rounded-lg h-[400px] ">
      <h2 className="text-lg font-bold text-gray-700 text-center">
        Task Progress
      </h2>
      <div className=" px-2 overflow-hidden h-[320px]">
  <Doughnut data={data} options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  }} />
</div>
      <p className="text-center mt-2 text-gray-600">
        Completed: {completedTasks} / {tasks.length}
      </p>
    </div>
  );
};

export default RealTimeChart;
