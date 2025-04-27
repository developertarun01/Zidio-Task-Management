import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TaskList from "../components/TaskList";
import Sidebar from "./Sidebar";

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
const [users, setUsers] = useState("");
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/tasks/my-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        toast.error("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <div className="flex bg-darkBg min-h-screen text-white">
      <Sidebar user={users} />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-cyan-300"
        >
          👤 Welcome, {users.username || "User"}!
        </motion.h1>
        <div className="mt-6">
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
