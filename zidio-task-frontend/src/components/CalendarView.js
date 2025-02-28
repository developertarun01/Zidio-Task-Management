import React from "react";
import { format, parseISO, getYear, getMonth } from "date-fns";

const CalendarView = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Calendar View</h2>
                <p className="text-gray-600 text-center">No tasks available. Add some tasks to get started!</p>
            </div>
        );
    }

    const tasksByMonthYear = tasks.reduce((acc, task) => {
        if (!task.deadline) return acc; // Skip if deadline is null or undefined
    
        try {
            const date = parseISO(task.deadline);
            const year = getYear(date);
            const month = getMonth(date);
            const formattedDate = format(date, "yyyy-MM-dd");
    
            if (!acc[year]) acc[year] = {};
            if (!acc[year][month]) acc[year][month] = {};
            if (!acc[year][month][formattedDate]) acc[year][month][formattedDate] = [];
    
            acc[year][month][formattedDate].push(task);
        } catch (error) {
            console.error("Invalid date format:", task.deadline);
        }
    
        return acc;
    }, {});
    

    return (
        <div className="bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Calendar View</h2>

            <div className="overflow-x-auto">
                {Object.keys(tasksByMonthYear)
                    .sort((a, b) => a - b)
                    .map((year) => {
                        const months = Object.keys(tasksByMonthYear[year]).sort((a, b) => a - b);
                        return (
                            <div key={year} className="mb-10">
                                {/* Loop through months in pairs */}
                                {months.map((month, index) => {
                                    if (index % 2 !== 0) return null; // Skip odd indices for pairing

                                    const nextMonth = months[index + 1]; // Get the next month if available
                                    return (
                                        <div key={month} className="mb-8">
                                            {/* Desktop: Two Months in a Row */}
                                            <div className="hidden md:grid grid-cols-2 gap-6">
                                                {[month, nextMonth].map((m, idx) => {
                                                    if (!m) return null;
                                                    const taskDates = Object.keys(tasksByMonthYear[year][m]).sort();

                                                    return (
                                                        <div key={idx} className="bg-white p-4 rounded shadow">
                                                            <h3 className="text-lg font-bold text-gray-800 text-center bg-gray-200 py-2 rounded">
                                                                {format(new Date(year, m), "MMMM yyyy")}
                                                            </h3>

                                                            <div className="grid grid-cols-7 gap-2 mt-2">
                                                                {taskDates.map((date) => (
                                                                    <div key={date} className="p-2 border rounded bg-white flex flex-col text-center text-sm">
                                                                        <h4 className="font-bold">{format(parseISO(date), "dd")}</h4>
                                                                        {tasksByMonthYear[year][m][date].map((task) => (
                                                                            <div key={task._id} className="mt-2 bg-blue-100 text-blue-600 text-xs rounded px-2 py-1">
                                                                                {task.title}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Mobile: List Format (Show Both Months) */}
                                            <div className="md:hidden flex flex-col gap-4 mt-2">
                                                {[month, nextMonth].map((m, idx) => {
                                                    if (!m) return null;
                                                    return (
                                                        <div key={idx}>
                                                            <h3 className="text-lg font-bold text-gray-800 text-center bg-gray-200 py-2 rounded ">
                                                                {format(new Date(year, m), "MMMM yyyy")}
                                                            </h3>
                                                            {Object.keys(tasksByMonthYear[year][m]).sort().map((date) => (
                                                                <div key={date} className="p-2 border rounded bg-white flex flex-col items-center text-sm">
                                                                    <h4 className="font-bold">{format(parseISO(date), "EEE, dd MMM")}</h4>
                                                                    {tasksByMonthYear[year][m][date].map((task) => (
                                                                        <div key={task._id} className="mt-2 bg-blue-100 text-blue-600 text-xs rounded px-2 py-1 text-center">
                                                                            {task.title}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default CalendarView;
