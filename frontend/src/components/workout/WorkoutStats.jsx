import React from 'react';
import { Activity, Flame, Clock, Target } from 'lucide-react';

const WorkoutStats = ({ stats, entries, weeklyStats }) => {
  // Calculate additional stats from entries
  const calculateAdditionalStats = () => {
    if (!entries) return {};
    
    const totalDuration = entries.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0);
    const avgDuration = entries.length > 0 ? totalDuration / entries.length : 0;
    const totalCalories = entries.reduce((sum, entry) => sum + (parseFloat(entry.caloriesBurned) || 0), 0);
    
    // Count by workout type
    const typeCounts = {};
    entries.forEach(entry => {
      typeCounts[entry.workoutType] = (typeCounts[entry.workoutType] || 0) + 1;
    });
    
    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, 'None'
    );

    return {
      totalDuration,
      avgDuration: Math.round(avgDuration),
      totalCalories: Math.round(totalCalories),
      mostCommonType
    };
  };

  const additionalStats = calculateAdditionalStats();

  const statsCards = [
    {
      title: 'Total Workouts',
      value: weeklyStats.totalWorkouts || 0,
      change: weeklyStats.workoutsChange || '+0%',
      icon: Activity,
      color: 'blue',
      description: 'This week'
    },
    {
      title: 'Calories Burned',
      value: weeklyStats.caloriesBurned || 0,
      change: weeklyStats.caloriesChange || '+0%',
      icon: Flame,
      color: 'red',
      description: 'This week'
    },
    {
      title: 'Total Duration',
      value: `${weeklyStats.totalDuration || 0} min`,
      change: weeklyStats.durationChange || '+0%',
      icon: Clock,
      color: 'green',
      description: 'This week'
    },
    {
      title: 'Weekly Goal',
      value: `${weeklyStats.weeklyGoal || 0}%`,
      change: weeklyStats.goalChange || '+0%',
      icon: Target,
      color: 'orange',
      description: '5 workouts per week'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Average Duration</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {additionalStats.avgDuration} minutes
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Calories</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {additionalStats.totalCalories} cal
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Most Common Type</p>
          <p className="text-xl font-bold text-gray-900 mt-1 capitalize">
            {additionalStats.mostCommonType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;