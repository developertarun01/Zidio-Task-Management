// components/TaskListTableView.js
import React from "react";

const TaskListTableView = ({ tasks, onDelete, onStatusToggle, onEdit }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-center">Deadline</th>
            <th className="py-3 px-6 text-center">Priority</th>
            <th className="py-3 px-6 text-center">Status</th>
            <th className="py-3 px-6 text-center"></th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {task.title}
              </td>
              <td className="py-3 px-6 text-left">{task.description}</td>
              <td className="py-3 px-6 text-center">
                {new Date(task.deadline).toLocaleDateString()}
              </td>
              <td
                className={`py-3 px-6 text-center font-medium ${
                  task.priority === "High"
                    ? "text-red-600"
                    : task.priority === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {task.priority}
              </td>
              <td
                className={`py-3 px-6 text-center ${
                  task.status === "completed"
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {task.status}
              </td>
              <td>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => onDelete(task._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => onStatusToggle(task._id, task.status)}
                  >
                    {task.status === "completed"
                      ? "Mark Pending"
                      : "Mark Done"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTableView;
