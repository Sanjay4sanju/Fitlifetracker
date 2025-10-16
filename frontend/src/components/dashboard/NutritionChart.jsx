import React, { useState, useMemo } from 'react';
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
import { TrendingUp, Calendar, Smartphone, Monitor, Utensils } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NutritionChart = ({ data, loading = false }) => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 14d, 30d

  // Memoized chart data calculation
  const { chartData, chartOptions, isEmpty } = useMemo(() => {
    const entries = data?.entries || [];
    
    const getDaysRange = (days) => 
      Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();

    const ranges = {
      '7d': getDaysRange(7),
      '14d': getDaysRange(14),
      '30d': getDaysRange(30)
    };

    const currentRange = ranges[timeRange];
    const dailyData = currentRange.map(date => {
      const dayEntries = entries.filter(entry => {
        try {
          return format(new Date(entry.dateConsumed), 'yyyy-MM-dd') === date;
        } catch {
          return false;
        }
      });
      
      return {
        date,
        totalCalories: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0),
        totalProtein: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0),
        totalCarbs: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.carbohydrates) || 0), 0),
        totalFat: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.fat) || 0), 0),
      };
    });

    const isEmpty = entries.length === 0;

    const chartData = {
      labels: dailyData.map(day => {
        const date = new Date(day.date);
        return window.innerWidth < 640 
          ? format(date, 'd') // Day only on mobile
          : format(date, 'MMM d'); // Month + day on desktop
      }),
      datasets: [
        {
          label: 'Calories',
          data: dailyData.map(day => day.totalCalories),
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Protein (g)',
          data: dailyData.map(day => day.totalProtein),
          backgroundColor: 'rgba(16, 185, 129, 0.9)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Carbs (g)',
          data: dailyData.map(day => day.totalCarbs),
          backgroundColor: 'rgba(139, 92, 246, 0.9)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };

    const isMobile = window.innerWidth < 768;

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isMobile ? 'bottom' : 'top',
          labels: {
            boxWidth: 12,
            padding: isMobile ? 10 : 15,
            font: {
              size: isMobile ? 10 : 12,
            },
            usePointStyle: true,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1f2937',
          bodyColor: '#374151',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 11,
            },
            maxRotation: isMobile ? 45 : 0,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 11,
            },
            callback: function(value) {
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k';
              }
              return value;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: {
        duration: 750,
      },
    };

    return { chartData, chartOptions, isEmpty };
  }, [data, timeRange]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 h-[460px] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-80 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300">
      {/* Header - Same structure as WorkoutChart */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Utensils size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Nutrition Overview</h3>
              <p className="text-sm text-gray-500">Track your daily nutrition intake</p>
            </div>
          </div>
        </div>

        {/* Time Range Selector - Same height structure */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm font-medium text-gray-700 min-w-[80px]">Range:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {[
              { key: '7d', label: '7D' },
              { key: '14d', label: '14D' },
              { key: '30d', label: '30D' }
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  timeRange === range.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container - Increased height even more */}
      <div className="relative h-60 sm:h-86 lg:h-[420px] xl:h-[460px]">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">No Nutrition Data</p>
            <p className="text-sm text-center max-w-sm">
              Start logging your meals to see your nutrition trends and insights here.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Log First Meal
            </button>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Footer - Same as WorkoutChart */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Smartphone size={14} className="sm:hidden" />
          <Monitor size={14} className="hidden sm:block" />
          <span className="hidden sm:inline">Hover for details</span>
          <span className="sm:hidden">Tap bars for details</span>
        </div>
        <div className="text-xs text-gray-500">
          Updated {format(new Date(), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;