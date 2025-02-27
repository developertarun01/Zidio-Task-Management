import React, { useState, useEffect } from "react";

const TaskList = ({ tasks, setTasks }) => {
    if (tasks.length === 0) {
        return (
            <div className="w-full bg-blue-50 rounded-lg p-4 mt-6 shadow-lg text-center">
                <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">Task List</h2>
                <p className="text-gray-600">No tasks available. Add some tasks to get started!</p>
            </div>
        );
    }

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const handleCompleteTask = async (taskId, currentStatus) => {
        try {
            const updatedTask = await fetch(`https://zidio-task-management-api.vercel.app/api/tasks${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
          status: currentStatus === "pending" ? "completed" : "pending",
        }),
            });

          
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, status: updatedTask.data.staus } : task
                    )
                );
            } 
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(
                `https://zidio-task-management-api.vercel.app/api/tasks/${taskId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            } else {
                console.error("Failed to delete task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Task List</h2>
            <div className="max-h-80 overflow-y-auto">
                <ul>
                    {sortedTasks.map((task) => (
                        <li
                            key={task._id}
                            className="border-b py-4 flex sm:flex-row flex-col sm:justify-between sm:items-center"
                        >
                            <div className="w-full sm:w-auto text-center sm:text-left">
                                <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-500">Subtasks: {task.subtasks?.join(", ")}</p>
                                <p className="text-sm text-gray-500">
                                    Priority: {task.priority} | Deadline:{" "}
                                    {new Date(task.deadline).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="w-full sm:w-auto flex flex-row justify-center items-center gap-2 mt-2 sm:mt-0">
                                <button
                                    className={`px-4 py-2 rounded ${task.status? "bg-green-500" : "bg-gray-400"} text-white`}
                                    onClick={() => handleCompleteTask(task._id, task.status)}
                                >
                                    {task.status=== "completed" ? "Mark Pending" : "Complete"}
                                </button>
                                <button
                                    className="px-4 py-2 mr-3 bg-red-500 text-white rounded"
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskList;
