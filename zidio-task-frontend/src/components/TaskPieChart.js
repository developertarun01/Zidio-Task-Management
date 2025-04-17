// components/TaskPieByUser.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskPieByUser = ({ taskData=[]}) => {
  const assigneeCounts = {};

  taskData.forEach((task) => {
    const user = task.assignee;
    assigneeCounts[user] = (assigneeCounts[user] || 0) + 1;
  });

  const colors = [
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#a78bfa",
    "#f472b6",
  ]; // Add more if needed

  const chartData = {
    labels: Object.keys(assigneeCounts),
    datasets: [
      {
        data: Object.values(assigneeCounts),
        backgroundColor: colors.slice(0, Object.keys(assigneeCounts).length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-sm mx-auto">
      <Pie data={chartData} />
    </div>
  );
};

export default TaskPieByUser;
