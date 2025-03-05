import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, Filler } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, Filler);

const Chart = ({ tasks }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const labels = tasks.map((task) => task.title);
    const progressData = tasks.map((task) => (task.completed ? 100 : 0));

    setChartData({
      labels,
      datasets: [
        {
          label: "Completion Progress (%)",
          data: progressData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    });
  }, [tasks]);

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
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Progress Graph</h2>
      <div className="h-72 sm:h-96 md:h-72 lg:h-80 w-full">
        {chartData.labels.length > 0 ? <Line data={chartData} options={options} /> : <p className="text-gray-600 text-center">No data available.</p>}
      </div>
    </div>
  );
};

export default Chart;
