import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import CalendarView from "../components/CalendarView";
import Chart from "../components/Chart";
import ProgressChart from "../components/ProgressChart";
import { io } from "socket.io-client";
import RealtimeChart from "../components/RealTimeChart";
import TaskPriorityChart from "../components/TaskPriorityChart";

// Initialize Socket.IO
const socket = io("http://localhost:4004/"); // Backend URL

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4004/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("❌Error fetching tasks:", error);
    }
  };

  // ✅ Add a new task
  const handleAddTask = async (task) => {
    try {
      const response = await axios.post("http://localhost:4004/tasks", task);
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

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4004/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Real-time updates using Socket.IO
  useEffect(() => {
    fetchTasks();

    // ✅ Listen for new tasks added in real-time
    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });
    //✅Listen for updated task in real-time
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });
    //✅Listen for deleted task in real-time
    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    });
    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  return (
    <main className="container mx-auto px-4">
      <div className="container flex flex-col md:flex-row items-stretch mx-auto space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 bg-blue-50 rounded-lg p-6 flex flex-col justify-center items-center shadow-lg">
          <h4 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
            Welcome to
          </h4>
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            Zidio Task Management
          </h2>
          <p className="text-lg text-gray-600 text-center px-4">
            Stay organized and boost productivity with Zidio. Effortlessly
            manage, track, and complete your tasks on time.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <TaskAssignment onAddTask={handleAddTask} />
        </div>
      </div>
      <div className="mt-6">
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>
      <div className="flex gap-3">
        <div className="mt-6">
          <TaskPriorityChart tasks={tasks} setTasks={setTasks} />
        </div>
        <div className="mt-6">
          <RealtimeChart tasks={tasks} />
        </div>
      </div>

      <div className="mt-6">
        <Chart tasks={tasks} />
      </div>

      <div className="mt-6">
        <ProgressChart tasks={tasks} />
      </div>

      <div className="mt-6">
        <CalendarView tasks={tasks} />
      </div>
    </main>
  );
};

export default Home;
