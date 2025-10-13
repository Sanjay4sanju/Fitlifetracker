import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NutritionChart = ({ data }) => {
  // If we have nutrition entries, create chart data from them
  const entries = data?.entries || [];
  
  // Group entries by date for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayEntries = entries.filter(entry => 
      format(new Date(entry.dateConsumed), 'yyyy-MM-dd') === date
    );
    
    return {
      date,
      totalCalories: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0),
      totalProtein: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0),
      totalCarbs: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.carbohydrates) || 0), 0),
    };
  });

  const chartData = {
    labels: dailyData.map(day => format(new Date(day.date), 'MMM d')),
    datasets: [
      {
        label: 'Calories',
        data: dailyData.map(day => day.totalCalories),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Protein (g)',
        data: dailyData.map(day => day.totalProtein),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Carbs (g)',
        data: dailyData.map(day => day.totalCarbs),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nutrition Overview (Last 7 Days)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {entries.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No nutrition data available for the last 7 days</p>
          <p className="text-sm">Start logging your meals to see charts here!</p>
        </div>
      )}
    </div>
  );
};

export default NutritionChart;