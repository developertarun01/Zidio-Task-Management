import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import CalendarView from "../components/CalendarView";
import Chart from "../components/Chart";
import ProgressChart from "../components/ProgressChart";

const axiosInstance = axios.create({
  baseURL: "https://zidio-task-management-api.vercel.app/api",
  withCredentials: true,
});

const socket = io("https://zidio-task-management-api.vercel.app", {
  transports: ["polling"],
  withCredentials: true,
});

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks!");
    }
  };

  const handleAddTask = async (task) => {
    try {
      const response = await axiosInstance.post("/tasks", task);
      const newTask = response.data;
      setTasks((prevTasks) => [...prevTasks, newTask]);
      socket.emit("task-added", newTask);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task!");
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("task-updated", (updatedTask) => {
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    });
    return () => {
      socket.off("task-updated");
    };
  }, []);

  return (
    <main className="container mx-auto px-4">
      <div className="container flex flex-col md:flex-row items-stretch mx-auto space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 bg-blue-50 rounded-lg p-6 flex flex-col justify-center items-center shadow-lg">
          <h4 className="text-2xl font-semibold text-gray-700 mb-2 text-center">Welcome to</h4>
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Zidio Task Management</h2>
          <p className="text-lg text-gray-600 text-center px-4">
            Stay organized and boost productivity with Zidio. Effortlessly manage, track, and complete your tasks on time.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <TaskAssignment onAddTask={handleAddTask} />
        </div>
      </div>
      <div className="mt-6"><TaskList tasks={tasks} setTasks={setTasks} /></div>
      <div className="mt-6"><Chart tasks={tasks} /></div>
      <div className="mt-6"><ProgressChart tasks={tasks} /></div>
      <div className="mt-6"><CalendarView tasks={tasks} /></div>
    </main>
  );
};

export default Home;