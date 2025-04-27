import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";

import TaskListCardView from "./TaskListCardView";
import TaskListTableView from "./TaskListTableView";
import EditTaskModal from "./EditTaskModal";

// Initialize socket connection outside the component
const socket = io("https://zidio-task-management-tanmoy9088.onrender.com", { autoConnect: false });

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("card");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Username:", user.name);
  // console.log("Username:", user.username);

  const fetchTasks = async () => {
    try {
      const { data: allTasks } = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks", {
        withCredentials: true,
      });

      let visibleTasks = [];

      if (role === "admin") {
        visibleTasks = allTasks.filter(task => !task.deleted);
      } else {
        visibleTasks = allTasks.filter(
          task => task.assignedTo?.trim().toLowerCase() === user.name?.trim().toLowerCase() && !task.deleted
        );
      }

      setTasks(visibleTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please login again.");

      if (error.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.connect();

    const onTaskCreated = (task) => {
      if (role === "admin" || task.assignedTo?.trim().toLowerCase() === user.name?.trim().toLowerCase()) {
        setTasks(prev => [...prev, task]);
      }
    };

    const onTaskUpdated = (updatedTask) => {
      if (role === "admin" || updatedTask.assignedTo?.trim().toLowerCase() === user.name?.trim().toLowerCase()) {
        setTasks(prev =>
          prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    };

    const onTaskDeleted = (deletedTask) => {
      setTasks(prev => prev.filter(task => task._id !== deletedTask._id));
      toast.info(`Task "${deletedTask.title}" was moved to trash.`);
    };

    socket.on("taskCreated", onTaskCreated);
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      socket.off("taskCreated", onTaskCreated);
      socket.off("taskUpdated", onTaskUpdated);
      socket.off("taskDeleted", onTaskDeleted);
      socket.disconnect();
    };
  }, []);

  const handleStatusToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    try {
      const { data } = await axios.put(
        `https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/${taskId}`,
        { status: newStatus, completed: newStatus === "completed", progress: newStatus === "completed" ? "100" : "0" },
        { withCredentials: true }
      );

      setTasks(prev =>
        prev.map(task => (task._id === taskId ? { ...task, ...data } : task))
      );

      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (taskId, taskCreatedBy) => {
    if (role === "manager" && taskCreatedBy !== user.id) {
      toast.error("You can only delete your own tasks.");
      return;
    }

    try {
      await axios.delete(`https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/${taskId}`, {
        withCredentials: true,
      });

      await fetchTasks();
      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const { data } = await axios.put(
        `https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/${taskId}`,
        updatedData,
        { withCredentials: true }
      );

      setTasks(prev =>
        prev.map(task => (task._id === taskId ? { ...task, ...data } : task))
      );

      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleViewChange = (newView) => setView(newView);
  const handlePriorityFilterChange = (e) => setPriorityFilter(e.target.value);

  const filteredTasks = tasks
    .filter(task => priorityFilter === "All" || task.priority === priorityFilter)
    .sort((a, b) => {
      const priorities = { High: 3, Medium: 2, Low: 1 };
      return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
    });

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div>
          <button
            onClick={() => handleViewChange("card")}
            className={`px-4 py-2 rounded-lg mr-2 ${view === "card" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Card View
          </button>
          <button
            onClick={() => handleViewChange("table")}
            className={`px-4 py-2 rounded-lg ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Table View
          </button>
        </div>

        <select
          value={priorityFilter}
          onChange={handlePriorityFilterChange}
          className="px-4 py-2 border rounded-lg shadow-sm text-gray-700"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-[#042330] via-[#214753] to-[#06041e] rounded-lg shadow-lg p-6">
        {view === "card" ? (
          <TaskListCardView
            tasks={filteredTasks}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            role={role}
          />
        ) : (
          <TaskListTableView
            tasks={filteredTasks}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            role={role}
          />
        )}
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onSave={handleTaskUpdate}
      />
    </div>
  );
};

export default TaskList;
