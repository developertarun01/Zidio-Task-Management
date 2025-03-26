import React, { useEffect, useState } from "react";

const Trash = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);

  // Fetch deleted tasks
  useEffect(() => {
    fetch("http://localhost:4004/trash")
      .then((res) => res.json())
      .then((data) => setDeletedTasks(data))
      .catch((err) => console.error("Error fetching deleted tasks:", err));
  }, []);

  // Restore Task
  const restoreTask = (id) => {
    fetch(`http://localhost:4004/restore/${id}`, { method: "PUT" })
      .then(() => setDeletedTasks(deletedTasks.filter(task => task._id !== id)))
      .catch((err) => console.error("Error restoring task:", err));
  };

  // Permanently Delete Task
  const deleteTaskPermanently = (id) => {
    fetch(`http://localhost:4004/delete/${id}`, { method: "DELETE" })
      .then(() => setDeletedTasks(deletedTasks.filter(task => task._id !== id)))
      .catch((err) => console.error("Error deleting task permanently:", err));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">🗑 Trash</h1>
      {deletedTasks.length === 0 ? (
        <p className="text-center mt-4 text-gray-600">No deleted tasks</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {deletedTasks.map((task) => (
            <li key={task._id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className="space-x-2">
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => restoreTask(task._id)}
                >
                  Restore
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteTaskPermanently(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trash;
