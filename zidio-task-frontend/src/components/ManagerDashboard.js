import React from "react";
import { motion } from "framer-motion";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import Sidebar from "./Sidebar";

const ManagerDashboard = ({ tasks, user }) => {
  return (
    <div className="flex bg-darkBg min-h-screen text-white">
      <Sidebar user={user} />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-green-300"
        >
          👨‍💼 Welcome, {user?.name || "Manager"}!
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskAssignment />
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
