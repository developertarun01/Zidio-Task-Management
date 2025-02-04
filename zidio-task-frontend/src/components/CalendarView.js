import React from "react";
import { format, parseISO } from "date-fns";

const CalendarView = ({ tasks }) => {
    const today = new Date();

    // Group tasks by deadline
    const tasksByDate = tasks.reduce((acc, task) => {
        const deadline = format(parseISO(task.deadline), "yyyy-MM-dd");
        acc[deadline] = acc[deadline] || [];
        acc[deadline].push(task);
        return acc;
    }, {});

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="bg-gray-200 rounded-lg p-4 mt-9">
            <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Calendar View</h2>
            <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day) => {
                    const date = format(new Date(today.getFullYear(), today.getMonth(), day), "yyyy-MM-dd");
                    return (
                        <div
                            key={day}
                            className="p-2 border rounded flex bg-white flex-col justify-between"
                        >
                            <h3 className="font-bold text-sm">{day}</h3>
                            {tasksByDate[date] ? (
                                tasksByDate[date].map((task) => (
                                    <div
                                        key={task._id}
                                        className="mt-2 bg-blue-100 text-blue-600 text-xs rounded px-2 py-1"
                                    >
                                        {task.title}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400">No tasks</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
