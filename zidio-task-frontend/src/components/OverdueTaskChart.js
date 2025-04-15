import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OverdueTaskChart = ({ tasks }) => {
  const overdueTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) < new Date() && task.status !== "completed"
  );
  const upcomingTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) > new Date() && task.status !== "completed"
  );

  const data = [
    { name: "Overdue", value: overdueTasks.length },
    { name: "Upcoming", value: upcomingTasks.length },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverdueTaskChart;
