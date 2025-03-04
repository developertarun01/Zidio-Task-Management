import React, { useState } from "react";

const TaskList = ({ tasks, setTasks }) => {
    const [comments, setComments] = useState({}); // Store comments for each task

    if (tasks.length === 0) {
        return (
            <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg text-center">
                <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">Task List</h2>
                <p className="text-gray-600">No tasks available. Add some tasks to get started!</p>
            </div>
        );
    }

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const handleCompleteTask = async (taskId, completed) => {
        try {
            const response = await fetch(`https://zidio-task-management-api.vercel.app/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !completed }),
            });

            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, completed: !completed } : task
                    )
                );
            } else {
                console.error("Failed to update task status.");
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

    const handleAddComment = async (taskId, comment, setComment) => {
        if (!comment.trim()) return;

        try {
            const response = await fetch(`https://zidio-task-management-api.vercel.app/api/tasks/${taskId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment }),
            });

            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId
                            ? { ...task, comments: [...(task.comments || []), comment] }
                            : task
                    )
                );
                setComment("");
            } else {
                console.error("Failed to add comment:", await response.json());
            }
        } catch (error) {
            console.error("Error adding comment:", error);
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
                            className="border-b py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                        >
                            <div className="w-1/3 sm:w-auto text-center sm:text-left">
                                <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-500">Subtasks: {task.subtasks?.join(", ")}</p>
                                <p className="text-sm text-gray-500">
                                    Priority: {task.priority} | Deadline:{" "}
                                    {new Date(task.deadline).toLocaleDateString()}
                                </p>
                            </div>


                            {/* Comment Section */}
                            <div className="w-1/3 mt-4">
                                <h4 className="text-sm font-bold text-gray-600">Comments:</h4>
                                <ul className="text-sm text-gray-700 bg-white p-2 rounded-lg shadow-sm">
                                    {task.comments && task.comments.length > 0 ? (
                                        task.comments.map((c, index) => (
                                            <li key={index} className="border-b py-1">
                                                {c}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No comments yet.</p>
                                    )}
                                </ul>

                                {/* Add Comment Input */}
                                <div className="flex items-center mt-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={comments[task._id] || ""}
                                        onChange={(e) =>
                                            setComments({ ...comments, [task._id]: e.target.value })
                                        }
                                        className="border rounded p-2 w-full"
                                    />
                                    <button
                                        onClick={() => handleAddComment(task._id)}
                                        className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>

                            </div>
                            <div className="w-full sm:w-auto flex flex-row justify-center items-center gap-2 mt-2 sm:mt-0">
                                <button
                                    className={`px-4 py-2 rounded ${task.completed ? "bg-green-500" : "bg-gray-400"} text-white`}
                                    onClick={() => handleCompleteTask(task._id, task.completed)}
                                >
                                    {task.completed ? "Completed" : "Mark Complete"}
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
