import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WorkoutChart = ({ data }) => {
  // If we have workout entries, create chart data from them
  const entries = data?.entries || [];
  
  // Group entries by date for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayEntries = entries.filter(entry => 
      format(new Date(entry.datePerformed), 'yyyy-MM-dd') === date
    );
    
    return {
      date,
      totalCaloriesBurned: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.caloriesBurned) || 0), 0),
      totalDuration: dayEntries.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0),
    };
  });

  const chartData = {
    labels: dailyData.map(day => format(new Date(day.date), 'MMM d')),
    datasets: [
      {
        label: 'Calories Burned',
        data: dailyData.map(day => day.totalCaloriesBurned),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Workout Duration (min)',
        data: dailyData.map(day => day.totalDuration),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Activity (Last 7 Days)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Calories Burned',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Duration (min)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {entries.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No workout data available for the last 7 days</p>
          <p className="text-sm">Start logging your workouts to see charts here!</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutChart;