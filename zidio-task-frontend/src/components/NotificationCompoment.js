import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const socket = io("https://zidio-task-management-tanmoy9088.onrender.com/");

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);

  const playSound = () => {
    const audio = new Audio("/notify.mp3"); // Make sure the file exists in /public
    audio.play().catch((err) => console.log("Sound error:", err));
  };

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    playSound();
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    socket.on("taskAdded", (task) => {
      addNotification(
        `🆕 Task Added: "${task.title}" due ${new Date(
          task.deadline
        ).toLocaleDateString()}`,
        "success"
      );
    });

    socket.on("taskUpdated", (task) => {
      addNotification(
        `🔄 Task Updated: "${task.title}" - ${task.status}`,
        "info"
      );
    });

    socket.on("taskDeleted", (taskId) => {
      addNotification(`🗑️ Task Deleted`, "error");
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {notifications.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`relative px-5 py-3 rounded-xl shadow-lg text-white backdrop-blur-lg glass border border-white/10
              ${
                type === "success"
                  ? "bg-green-500/80"
                  : type === "error"
                  ? "bg-red-500/80"
                  : "bg-blue-500/80"
              }`}
          >
            <button
              onClick={() => handleDismiss(id)}
              className="absolute top-1 right-2 text-white text-lg hover:scale-125 transition"
            >
              ❌
            </button>
            {message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
