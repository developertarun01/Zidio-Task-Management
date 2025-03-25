import React, { useEffect, useState } from "react";
import apiClient from "../../api/client"; // Updated import for configured axios instance
import socket from "../../utils/socket"; // Using centralized socket configuration
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        let url = '/tasks';
        if (filter !== "All") url += `/filter/${filter}`;

        const response = await apiClient.get(url);
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
          setError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, navigate]);

  useEffect(() => {
    // Socket.io event listeners
    const onTaskAdded = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const onTaskUpdated = (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    const onTaskDeleted = (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    };

    socket.on("taskAdded", onTaskAdded);
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      socket.off("taskAdded", onTaskAdded);
      socket.off("taskUpdated", onTaskUpdated);
      socket.off("taskDeleted", onTaskDeleted);
    };
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      // Socket.io will handle the UI update via the event listener
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}`, {
        status: currentStatus === "pending" ? "completed" : "pending",
        progress: currentStatus === "pending" ? '100' : '0',
      });
      // Socket.io will handle the UI update via the event listener
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="bg-blue-100 px-0 pt-2 w-100 h-[400px] rounded-lg shadow-lg">
      <h2 className="text-center text-lg font-bold">Task List</h2>
      <select
        className="bg-yellow-50 mt-2 rounded-lg shadow-md border-spacing-1"
        onChange={(e) => setFilter(e.target.value)}
        disabled={loading}
      >
        <option value="All">All</option>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <div className="overflow-auto mt-2 w-100 max-h-[320px]">
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            {error.includes("401") ? (
              <p>Please login to view tasks</p>
            ) : (
              <p>Error loading tasks: {error}</p>
            )}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-3 border-b"
              >
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <span
                    className={`font-medium ${task.status === "completed"
                        ? "text-green-500 line-through"
                        : "text-gray-800"
                      }`}
                  >
                    {task.title}
                  </span>
                  {task.subtasks?.length > 0 ? (
                    <ul className="ml-4">
                      {task.subtasks.map((subtask, index) => (
                        <li key={index} className="text-gray-600">
                          {subtask.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No subtasks</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Priority: {task.priority} | Deadline:{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded ${task.status === "completed"
                        ? "bg-gray-400"
                        : "bg-green-500 text-white"
                      }`}
                    onClick={() => toggleTaskStatus(task._id, task.status)}
                    disabled={loading}
                  >
                    {task.status === "completed" ? "Mark Pending" : "Complete"}
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(task._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;