import React from 'react';
import { Utensils, Flame, Zap, Target, TrendingUp, TrendingDown } from 'lucide-react';

const NutritionStats = ({ weeklyStats }) => {
  const stats = [
    {
      title: 'Total Entries',
      value: weeklyStats.totalEntries || 0,
      change: weeklyStats.entriesChange || '+0%',
      icon: Utensils,
      color: 'blue',
      description: 'This week'
    },
    {
      title: 'Calories',
      value: weeklyStats.totalCalories || 0,
      change: weeklyStats.caloriesChange || '+0%',
      icon: Flame,
      color: 'red',
      description: 'This week'
    },
    {
      title: 'Protein',
      value: `${weeklyStats.totalProtein || 0}g`,
      change: weeklyStats.proteinChange || '+0%',
      icon: Zap,
      color: 'green',
      description: 'This week'
    },
    {
      title: 'Weekly Goal',
      value: `${weeklyStats.weeklyGoal || 0}%`,
      change: weeklyStats.goalChange || '+0%',
      icon: Target,
      color: 'purple',
      description: '21 meals per week'
    }
  ];

  const getTrendIcon = (change) => {
    const value = parseInt(change);
    if (value > 0) return <TrendingUp size={16} className="text-green-600" />;
    if (value < 0) return <TrendingDown size={16} className="text-red-600" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              stat.change.startsWith('+') 
                ? 'bg-green-100 text-green-800' 
                : stat.change.startsWith('-')
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {getTrendIcon(stat.change)}
              <span>{stat.description}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NutritionStats;