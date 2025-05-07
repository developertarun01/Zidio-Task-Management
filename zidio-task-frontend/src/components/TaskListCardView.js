import React from "react";
import { Edit, Trash2, CheckCircle, Undo2 } from "lucide-react";
import { getPriorityColor } from "../utils/colors"; // If you use a utility for priority colors

const TaskListCardView = ({ tasks, onDelete, onStatusToggle, onEdit }) => {
  // Role-based filtering logic
  const filteredTasks = tasks;
  // const role = localStorage.getItem("userRole");
  // const email = localStorage.getItem("userEmail"); // Storing the role in localStorage
  // const name = localStorage.getItem("userName");
  // const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="bg-white/10 backdrop-blur-lg border border-gray-300 dark:border-gray-600 rounded-2xl p-5 shadow-xl text-white transition hover:-translate-y-1 hover:shadow-2xl duration-300"
        >
          <h2 className="text-xl font-bold mb-2">{task.title}</h2>
          <p className="text-sm text-gray-300 mb-2">{task.description}</p>
          {/* ✅ Show assigned user's name */}
          <div className="max-h-20 overflow-y-auto space-y-1">
            {task.assignedTo.map((username) => (
              <span
                key={username}
                className="inline-flex items-center gap-1 bg-cyan-600/50 px-2 py-1 mr-1 mb-1 rounded-full text-xs"
              >
                {username}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Created by: {task.createdBy || "Unassigned"} (
            {task.assignedTo?.email})
          </p>
          <p className="text-sm text-gray-400">
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </p>
          <p
            className={`text-sm mt-2 ${
              task.priority === "High"
                ? "text-red-400"
                : task.priority === "Medium"
                ? "text-yellow-300"
                : "text-green-300"
            }`}
          >
            Priority: {task.priority}
          </p>
          <p
            className={`text-xs mt-2 ${
              task.status === "completed" ? "text-green-400" : "text-blue-400"
            }`}
          >
            Status: {task.status}
          </p>

          <div className="flex flex-wrap gap-2 mt-4 justify-between">
            <button
              onClick={() => onEdit(task)}
              className="flex text-sm items-center gap-1 flex-1 min-w-[90px] justify-center bg-blue-500/20 border border-blue-400 hover:bg-blue-600 hover:text-white text-blue-200 py-2 px-3 rounded-xl shadow-md transition-all duration-300"
            >
              <Edit size={16} /> Edit
            </button>

            <button
              onClick={() => onDelete(task._id)}
              className="flex items-center text-sm  gap-1 flex-1 min-w-[90px] justify-center bg-red-500/20 border border-red-400 hover:bg-red-600 hover:text-white text-red-200 py-2 px-3 rounded-xl shadow-md transition-all duration-300"
            >
              <Trash2 size={16} /> Delete
            </button>

            <button
              onClick={() => onStatusToggle(task._id, task.status)}
              className={`flex items-center justify-center gap-1 flex-1 min-w-[110px] backdrop-blur-md bg-white/10 ${
                task.status === "completed"
                  ? "border border-yellow-400 text-yellow-100 hover:bg-yellow-500 hover:text-white"
                  : "border border-green-400 text-green-100 hover:bg-green-500 hover:text-white"
              } text-sm py-2 px-3 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300`}
            >
              {task.status === "completed" ? (
                <>
                  <Undo2 size={16} /> Mark Pending
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Mark Done
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListCardView;
