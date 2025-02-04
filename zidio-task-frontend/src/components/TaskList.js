import React from "react";

const TaskList = ({ tasks }) => {

    if (tasks.length === 0) {
        return (
            <div className="w-1/2 bg-gray-200 rounded-lg p-4 mt-9 ml-5">
                <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Task List</h2>
                <p className="text-gray-600">No tasks available. Add some tasks to get started!</p>
            </div>
        )

    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li
                        key={task._id}
                        className="border-b py-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Priority: {task.priority} | Deadline:{" "}
                                {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <button
                                className={`px-4 py-2 rounded ${task.completed ? "bg-green-500" : "bg-gray-300"
                                    } text-white mr-2`}
                                onClick={() => {
                                    task.completed = !task.completed;
                                    // Call backend API to update the task's completion status here.
                                }}
                            >
                                {task.completed ? "Completed" : "Mark Complete"}
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => {
                                    // Call backend API to delete the task here.
                                    console.log("Task deleted:", task._id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
