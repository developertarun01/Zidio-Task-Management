import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ProgressChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Progress Chart</h2>
        <p className="text-gray-600">No tasks available to display progress.</p>
      </div>
    );
  }

  const chartData = {
    labels: tasks.map((task) => task.title),
    datasets: [
      {
        label: "Completion Progress (%)",
        data: tasks.map((task) => task.completed ? 100 : 0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Progress Chart</h2>
      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
