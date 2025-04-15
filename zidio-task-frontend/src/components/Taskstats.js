import React from "react";
import CountUp from "react-countup";
import {
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChartPie,
} from "react-icons/fa";

const TaskStats = ({ tasks, onFilterSelect, selectedFilter }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter(
    (t) => new Date(t.deadline) < new Date() && t.status !== "completed"
  ).length;
  const upcoming = tasks.filter((t) => {
    const deadline = new Date(t.deadline);
    const now = new Date();
    return deadline > now && deadline - now < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      title: "Total Tasks",
      value: total,
      icon: <FaTasks />,
      color: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900",
      filter: "all",
    },
    {
      title: "Completed",
      value: completed,
      icon: <FaCheckCircle />,
      color: "bg-gradient-to-r from-green-200 to-green-400 text-green-900",
      filter: "completed",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: <FaHourglassHalf />,
      color: "bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900",
      filter: "pending",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: <FaExclamationTriangle />,
      color: "bg-gradient-to-r from-red-200 to-red-400 text-red-900",
      filter: "overdue",
    },
    {
      title: "Upcoming",
      value: upcoming,
      icon: <FaCalendarAlt />,
      color: "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900",
      filter: "upcoming",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: <FaChartPie />,
      color: "bg-gradient-to-r from-indigo-200 to-indigo-400 text-indigo-900",
      filter: null, // optional, no filter for this one
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl shadow-lg flex items-center justify-between transition-transform hover:scale-105 cursor-pointer ${
            card.color
          } ${
            selectedFilter === card.filter
              ? "ring-2 ring-cyan-400 scale-105"
              : ""
          }`}
          onClick={() => card.filter && onFilterSelect(card.filter)}
        >
          <div>
            <h4 className="text-md font-semibold">{card.title}</h4>
            <p className="text-2xl font-bold">
              <CountUp end={parseInt(card.value)} duration={1.5} />
            </p>
          </div>
          <div className="text-3xl">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
