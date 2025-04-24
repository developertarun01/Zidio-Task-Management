import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { io } from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";
import "@fullcalendar/common/main.min.css";

const socket = io("http://localhost:4004");

const CalendarView = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    priority: "all",
    status: "all",
    username: "all",
  });

  const formatTask = (task) => ({
    id: task._id,
    title: task.title,
    start: task.deadline,
    extendedProps: {
      priority: task.priority,
      status: task.status,
      username: task.username,
      deadline: task.deadline,
    },
  });

  const applyFilters = () => {
    const result = allTasks.filter((task) => {
      return (
        (filters.priority === "all" ||
          task.extendedProps.priority === filters.priority) &&
        (filters.status === "all" ||
          task.extendedProps.status === filters.status) &&
        (filters.username === "all" ||
          task.extendedProps.username === filters.username)
      );
    });
    setFilteredTasks(result);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4004/api/tasks");
      const formatted = res.data.map(formatTask);
      setAllTasks(formatted);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("taskAdded", (newTask) => {
      setAllTasks((prev) => [...prev, formatTask(newTask)]);
    });
    socket.on("taskUpdated", (updatedTask) => {
      setAllTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask._id ? formatTask(updatedTask) : task
        )
      );
    });
    socket.on("taskDeleted", (deletedId) => {
      setAllTasks((prev) => prev.filter((task) => task.id !== deletedId));
    });
    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allTasks]);

  const handleDateClick = async (arg) => {
    const { value: title } = await Swal.fire({
      title: "Create Task",
      input: "text",
      inputLabel: "Task Title",
      inputPlaceholder: "Enter task title",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
    });

    if (title) {
      try {
        const res = await axios.post("http://localhost:4004/api/tasks", {
          title,
          deadline: arg.dateStr,
          status: "pending",
          priority: "medium",
        });
        socket.emit("taskAdded", res.data);
      } catch (err) {
        console.error("Failed to create task", err);
      }
    }
  };

  const handleEventDrop = async ({ event }) => {
    const updatedDeadline = event.startStr;
    try {
      await axios.put(`http://localhost:4004/api/tasks/${event.id}`, {
        ...event.extendedProps,
        deadline: updatedDeadline,
      });
      socket.emit("taskUpdated", {
        ...event.extendedProps,
        _id: event.id,
        deadline: updatedDeadline,
      });
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleEventClick = ({ event }) => {
    const { title, extendedProps } = event;
    Swal.fire({
      title: title,
      html: `
        <strong>Priority:</strong> ${extendedProps.priority}<br/>
        <strong>Status:</strong> ${extendedProps.status}<br/>
        <strong>Assigned To:</strong> ${
          extendedProps.username || "Unassigned"
        }<br/>
        <strong>Deadline:</strong> ${new Date(
          extendedProps.deadline
        ).toLocaleDateString()}
      `,
      icon: "info",
      confirmButtonColor: "#00ffe0",
    });
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="flex  bg-gradient-to-br from-[#2bda42] via-[#11399f] to-[#2d61cfce] ">
      {/* Filters Sidebar */}
      <div className="bg-gradient-to-br from-[#c2b60f] via-[#214753] to-[#58cc97e5] w-64 p-4 rounded-xl glass border border-white/10 shadow-lg text-white mr-4">
        <h2 className="text-lg font-bold mb-4 text-center">Filters</h2>

        <div className="mb-4">
          <h3 className="text-md font-semibold">Priority</h3>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="w-full bg-transparent text-white border p-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold">Status</h3>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full bg-transparent text-white border p-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold">User</h3>
          <select
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
            className="w-full bg-transparent text-white border p-2 rounded-lg"
          >
            <option value="all">All</option>
            {[
              ...new Set(
                allTasks.map((t) => t.extendedProps.username).filter(Boolean)
              ),
            ].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl glass border border-white/10 shadow-lg text-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-center text-lime-400">
          📅 Task Calendar with Real-Time & Drag-Drop
        </h1>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          events={filteredTasks}
          editable={true}
          selectable={true}
          droppable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          eventClassNames={(arg) => {
            const priority = arg.event.extendedProps.priority;
            const status = arg.event.extendedProps.status;

            let base = "rounded-md px-1 text-xs";
            if (status === "completed")
              return `${base} bg-green-600 text-white border border-white`;
            if (priority === "high") return `${base} bg-red-600 text-white`;
            if (priority === "medium")
              return `${base} bg-yellow-400 text-black`;
            if (priority === "low") return `${base} bg-blue-500 text-white`;
            return `${base} bg-gray-500 text-white`;
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
