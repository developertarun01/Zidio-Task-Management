import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import socket from "../utils/socket";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4004");

const TaskCalendar = () => {
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

  return (
    <div className="h-[70vh] w-full">
      <FullCalendar
        timeZone="IST"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={tasks.map((task) => ({
          id: task._id,
          title: task.status === "completed" ? `✅${task.title}` : task.title,
          start: task.deadline,
          backgroundColor:
            task.priority === "High"
              ? "red"
              : task.priority === "Medium"
              ? "orange"
              : "green",
        }))}
        editable={true}
        eventClick={(info) => alert(`Task: ${info.event.title}`)}
        height="100%"
      />
    </div>
  );
};

export default TaskCalendar;
