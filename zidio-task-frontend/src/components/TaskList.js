// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// // Initialize Socket.IO
// const socket = io("https://zidio-task-management-api.vercel.app/"); // Backend URL

// const TaskList = ({ tasks, setTasks }) => {
//   // Real-time updates using Socket.IO
//   useEffect(() => {
//     fetchTasks();
//     // Listen for real-time updates
//     socket.on("task-updated", (updatedTask) => {
//       setTasks((prevTasks) => [...prevTasks, updatedTask]);
//     });
//     socket.on("taskUpdated", (updatedTask) => {
//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task._id === updatedTask._id ? updatedTask : task
//         )
//       );
//     });

//     socket.on("taskDeleted", (taskId) => {
//       setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
//     });
//     return () => {
//       socket.off("taskAdded");
//       socket.off("taskUpdated");
//       socket.off("taskDeleted");
//     };
//   }, []);
//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(
//         "https://zidio-task-management-api.vercel.app/api/tasks"
//       );
//       setTasks(response.data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   if (tasks.length === 0) {
//     return (
//       <div className="w-full bg-blue-50 rounded-lg p-4 mt-6 shadow-lg text-center">
//         <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
//           Task List
//         </h2>
//         <p className="text-gray-600">
//           No tasks available. Add some tasks to get started!
//         </p>
//       </div>
//     );
//   }

//   const sortedTasks = [...tasks].sort(
//     (a, b) => new Date(a.deadline) - new Date(b.deadline)
//   );

//   const handleCompleteTask = async (taskId, completed) => {
//     try {
//       const response = await fetch(
//         `https://zidio-task-management-api.vercel.app/api/tasks/${taskId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ completed: !completed }),
//         }
//       );

//       if (response.ok) {
//         const updatedTask = await response.json(); // Store response JSON in updatedTask

//         setTasks((prevTasks) =>
//           prevTasks.map((task) =>
//             task._id === taskId ? { ...task, status: updatedTask.status } : task
//           )
//         );
//       } else {
//         console.error("Failed to update task status.");
//       }
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       const response = await fetch(
//         `https://zidio-task-management-api.vercel.app/api/tasks/${taskId}`,
//         { method: "DELETE" }
//       );

//       if (response.ok) {
//         setTasks((prevTasks) =>
//           prevTasks.filter((task) => task._id !== taskId)
//         );
//       } else {
//         console.error("Failed to delete task.");
//       }
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   return (
//     <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
//       <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
//         Task List
//       </h2>
//       <div className="max-h-80 overflow-y-auto">
//         <ul>
//           {sortedTasks.map((task) => (
//             <li
//               key={task._id}
//               className="border-b py-4 flex sm:flex-row flex-col sm:justify-between sm:items-center"
//             >
//               <div className="w-full sm:w-auto text-center sm:text-left">
//                 <h3
//                   className={`font-bold ${
//                     task.completed ? "line-through" : ""
//                   }`}
//                 >
//                   {task.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Subtasks: {task.subtasks?.join(", ")}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Priority: {task.priority} | Deadline:{" "}
//                   {new Date(task.deadline).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="w-full sm:w-auto flex flex-row justify-center items-center gap-2 mt-2 sm:mt-0">
//                 <button
//                   className={`px-4 py-2 rounded ${
//                     task.completed ? "bg-green-500" : "bg-gray-400"
//                   } text-white`}
//                   onClick={() => handleCompleteTask(task._id, task.completed)}
//                 >
//                   {task.completed === "completed" ? "Mark Pending" : "Complete"}
//                 </button>
//                 <button
//                   className="px-4 py-2 mr-3 bg-red-500 text-white rounded"
//                   onClick={() => handleDeleteTask(task._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
// import socket from "../utils/socket";
import { io } from "socket.io-client";

const socket = io(`http://localhost:4004`);

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    let url = `http://localhost:4004/tasks`;
    if (filter !== "All") url += `/filter/${filter}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [filter]);
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
      const response = await axios.get(
        `http://localhost:4004/tasks`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Delete Task
  const handleDelete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:4004/trash/${taskId}`
      );
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from UI and adds to the trash-bin.
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Toggle Task Status (Complete/Pending)
  const toggleTaskStatus = async (taskId, currentStatus, progress) => {
    try {
      const updatedTask = await axios.put(
        `http://localhost:4004/tasks/${taskId}`,
        {
          status: currentStatus === "pending" ? "completed" : "pending",
          progress: currentStatus==="pending"? '100':'0',
        }
      );

      setTasks(
        tasks.map((task) =>
          task._id === taskId
            ? { ...task, status: updatedTask.data.status }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="bg-blue-100 px-0  pt-2 w-100 h-[400px] rounded-lg shadow-lg">
      <h2 className="text-center text-lg font-bold ">Task List</h2>
      <select
        className="bg-yellow-50 mt-2 rounded-lg shadow-md border-spacing-1"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>
      <div className="overflow-auto mt-2 w-100 max-h-[320px]">
        {tasks.length === 0 ? (
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
                    className={`font-medium ${
                      task.status === "completed"
                        ? "text-green-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.subtasks && task.subtasks.length > 0 ? (
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
                    className={`px-3 py-1 rounded ${
                      task.status === "completed"
                        ? "bg-gray-400"
                        : "bg-green-500 text-white"
                    }`}
                    onClick={() =>
                      toggleTaskStatus(task._id, task.status)
                    }
                  >
                    {task.status === "completed" ? "Mark Pending" : "Complete"}
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(task._id)}
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
