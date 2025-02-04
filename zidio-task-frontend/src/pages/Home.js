import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import CalendarView from "../components/CalendarView";
import { io } from "socket.io-client";

// Initialize Socket.IO
const socket = io("http://localhost:4000"); // Backend URL

const Home = () => {

  const chartData = {
    labels: ["Task 1", "Task 2", "Task 3"],
    datasets: [
      {
        label: "Completion Progress",
        data: [30, 60, 90],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks!");
    }
  };

  // Add a new task
  const handleAddTask = async (task) => {
    try {
      const response = await axios.post("http://localhost:4000/api/tasks", task);
      const newTask = response.data;
      setTasks([...tasks, newTask]);

      // Emit socket event
      socket.emit("task-added", newTask);

      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task!");
    }
  };

  // Real-time updates using Socket.IO
  useEffect(() => {
    fetchTasks();

    // Listen for real-time updates
    socket.on("task-updated", (updatedTask) => {
      setTasks((prevTasks) => [...prevTasks, updatedTask]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <main className="container mx-auto">
      <div className="container flex mx-auto">
        <TaskAssignment onAddTask={handleAddTask} />
        <TaskList tasks={tasks} />
      </div>

      {/* <Chart chartData={chartData} />
        <ProgressChart tasks={tasks} /> */}
      <CalendarView tasks={tasks} />
    </main>
  );
};

export default Home;
