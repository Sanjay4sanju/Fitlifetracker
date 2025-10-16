import React, { useState, useMemo } from 'react';
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
import { Activity, TrendingUp, Smartphone, Monitor } from 'lucide-react';

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

const WorkoutChart = ({ data, loading = false }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('both');

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
          return format(new Date(entry.datePerformed), 'yyyy-MM-dd') === date;
        } catch {
          return false;
        }
      });
      
      return {
        date,
        totalCaloriesBurned: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.caloriesBurned) || 0), 0),
        totalDuration: dayEntries.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0),
        workoutCount: dayEntries.length,
      };
    });

    const isEmpty = entries.length === 0;
    const isMobile = window.innerWidth < 768;

    const datasets = [];
    
    if (selectedMetric === 'calories' || selectedMetric === 'both') {
      datasets.push({
        label: 'Calories Burned',
        data: dailyData.map(day => day.totalCaloriesBurned),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: selectedMetric === 'calories',
        tension: 0.4,
        yAxisID: 'y',
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
      });
    }

    if (selectedMetric === 'duration' || selectedMetric === 'both') {
      datasets.push({
        label: 'Workout Duration (min)',
        data: dailyData.map(day => day.totalDuration),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: selectedMetric === 'duration' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
        fill: selectedMetric === 'duration',
        tension: 0.4,
        yAxisID: selectedMetric === 'both' ? 'y1' : 'y',
        borderDash: selectedMetric === 'both' ? [5, 5] : [],
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
      });
    }

    const chartData = {
      labels: dailyData.map(day => {
        const date = new Date(day.date);
        return window.innerWidth < 640 
          ? format(date, 'd')
          : format(date, 'MMM d');
      }),
      datasets,
    };

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
                const value = context.parsed.y;
                if (context.dataset.label.includes('Calories')) {
                  label += value.toLocaleString() + ' cal';
                } else if (context.dataset.label.includes('Duration')) {
                  label += value.toLocaleString() + ' min';
                } else {
                  label += value.toLocaleString();
                }
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
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: selectedMetric === 'both',
            text: 'Calories Burned',
          },
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
        y1: {
          type: 'linear',
          display: selectedMetric === 'both',
          position: 'right',
          title: {
            display: true,
            text: 'Duration (min)',
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 11,
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
  }, [data, timeRange, selectedMetric]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 h-96 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
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
      {/* Header - Stacked Controls like Mobile */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Activity size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Workout Activity</h3>
              <p className="text-sm text-gray-500">Track your exercise performance</p>
            </div>
          </div>
        </div>

        {/* Controls Section - Stacked Vertically */}
        <div className="flex flex-col gap-3">
          {/* Metric Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[80px]">Metrics:</span>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
              {[
                { key: 'both', label: 'Both' },
                { key: 'calories', label: 'Calories' },
                { key: 'duration', label: 'Duration' }
              ].map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    selectedMetric === metric.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Selector */}
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
      </div>

      {/* Chart Container */}
      <div className="relative h-64 sm:h-72 lg:h-80 xl:h-96">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <TrendingUp size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">No Workout Data</p>
            <p className="text-sm text-center max-w-sm">
              Start logging your workouts to track your fitness progress and see insights here.
            </p>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Log First Workout
            </button>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Smartphone size={14} className="sm:hidden" />
          <Monitor size={14} className="hidden sm:block" />
          <span className="hidden sm:inline">Hover for details</span>
          <span className="sm:hidden">Tap for details</span>
        </div>
        <div className="text-xs text-gray-500">
          Updated {format(new Date(), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default WorkoutChart;