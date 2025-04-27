import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthProvider } from "../context/AuthContext";
const Trash = () => {
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useContext(AuthProvider);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchTrashedTasks = async () => {
    try {
      const res = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/trash", {
        withCredentials: true,
      });
      setTrashedTasks(res.data);
      console.log("Trashed Tasks:", res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load trashed tasks");
      setLoading(false);
    }
  };

  const restoreTask = async (id) => {
    try {
      await axios.patch(
        `https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/restore/${id}`,

        { withCredentials: true }
      );
      toast.success("Task restored");
      fetchTrashedTasks();
    } catch (err) {
      toast.error("Restore failed");
    }
  };

  const deleteTaskForever = async (id) => {
    try {
      await axios.delete(`https://zidio-task-management-tanmoy9088.onrender.com/api/tasks/permanent/${id}`, {
        withCredentials: true,
      });
      toast.success("Task permanently deleted");
      fetchTrashedTasks();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  if (loading)
    return <div className="text-center text-lg mt-10">Loading trash...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🗑️ Trashed Tasks</h2>
      {trashedTasks.length === 0 ? (
        <p>No tasks in trash.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trashedTasks.map((task) => (
            <div key={task._id} className="bg-red-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-500">{task.title}</h3>
              <p className="text-sm text-gray-700 mb-2">{task.description}</p>
              <p className="text-sm text-gray-500">
                Deleted By: <strong>{user.name}</strong> <br />
                At: <strong>{new Date(task.deletedAt).toLocaleString()}</strong>
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => restoreTask(task._id)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Restore
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => deleteTaskForever(task._id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete Forever
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
