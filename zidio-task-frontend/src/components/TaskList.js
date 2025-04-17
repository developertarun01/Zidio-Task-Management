import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import TaskListCardView from "./TaskListCardView";
import TaskListTableView from "./TaskListTableView";
import EditTaskModal from "./EditTaskModal";
import io from "socket.io-client";

const socket = io("http://localhost:4004");

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("card");
  const [filters, setFilters] = useState({ priority: "", dueDate: "" });
  const [priorityFilter, setPriorityFilter] = useState("All");
  // const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail"); // Storing the role in localStorage
  const name = localStorage.getItem("userName");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(name);

  const fetchTasks = async () => {
    try {
      const taskRes = await axios.get("http://localhost:4004/api/tasks", {
        withCredentials: true,
      });
      const allTasks = taskRes.data;

      console.log("All tasks from backend:", allTasks);
      console.log("Current user name:", user.name);

      let visibleTasks = [];

      if (role === "admin") {
        visibleTasks = allTasks.filter((task) => !task.deleted);
      } else {
        visibleTasks = allTasks.filter((task) => {
          console.log("Comparing:", task.assignedTo, "with", user.name); // ← filter out soft-deleted
          return task.assignedTo === user.name && !task.deleted; // ← also filter out
        });
      }

      setTasks(visibleTasks);
      console.log(visibleTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Failed to fetch tasks. Please login again.");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("taskCreated", (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });
    socket.on("taskDeleted", (deletedTask) => {
      setTasks((prev) => prev.filter((task) => task._id !== deletedTask._id));
      toast.info(`Task "${deletedTask.title}" was moved to trash.`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStatusToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const completed = newStatus === "completed";
    const progress = completed ? "100" : "0";

    try {
      const updatedTask = await axios.put(
        `http://localhost:4004/api/tasks/${taskId}`,
        { status: newStatus, completed, progress },
        { withCredentials: true }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask.data } : task
        )
      );
      toast.info("Task status updated!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (taskId, taskCreatedBy) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (role === "manager" && taskCreatedBy !== userId) {
        toast.error("You can only delete your own tasks.");
        return;
      }

      await axios.delete(`http://localhost:4004/api/tasks/${taskId}`, {
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
    console.log("Editing task:", task);
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  const handleTaskUpdate = async (taskId, updatedData) => {
    // update task list logic here
    try {
      const updatedTask = await axios.put(
        `http://localhost:4004/api/tasks/${taskId}`,
        { updatedData },
        { withCredentials: true }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask.data } : task
        )
      );
      // socket.emit("updated task", updatedTask)
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleViewChange = (selectedView) => {
    setView(selectedView);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTasks = tasks
    .filter((task) => {
      let matches = true;
      if (filters.priority && task.priority !== filters.priority)
        matches = false;
      if (filters.dueDate && task.dueDate !== filters.dueDate) matches = false;
      if (priorityFilter !== "All" && task.priority !== priorityFilter)
        matches = false;
      return matches;
    })
    .sort((a, b) => {
      const priorities = { High: 3, Medium: 2, Low: 1 };
      return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
    });

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => handleViewChange("card")}
            className={`mr-2 px-4 py-2 rounded-lg ${
              view === "card"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => handleViewChange("table")}
            className={`px-4 py-2 rounded-lg ${
              view === "table"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Table View
          </button>
        </div>

        <select
          value={priorityFilter}
          onChange={handlePriorityFilterChange}
          className="border border-gray-300 text-stone-600 px-4 py-2 rounded-lg shadow-sm mb-2"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="">
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
