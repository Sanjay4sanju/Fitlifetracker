import React from 'react';
import { Activity, Flame, Clock, Target, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const WorkoutStats = ({ stats, entries, weeklyStats, loading = false }) => {
  // Calculate additional stats from entries
  const calculateAdditionalStats = () => {
    if (!entries || entries.length === 0) return {};
    
    const totalDuration = entries.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0);
    const avgDuration = entries.length > 0 ? totalDuration / entries.length : 0;
    const totalCalories = entries.reduce((sum, entry) => sum + (parseFloat(entry.caloriesBurned) || 0), 0);
    
    // Count by workout type
    const typeCounts = {};
    entries.forEach(entry => {
      const type = entry.workoutType || 'General';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const mostCommonType = Object.keys(typeCounts).length > 0 
      ? Object.keys(typeCounts).reduce((a, b) => 
          typeCounts[a] > typeCounts[b] ? a : b, 'General'
        )
      : 'None';

    return {
      totalDuration,
      avgDuration: Math.round(avgDuration),
      totalCalories: Math.round(totalCalories),
      mostCommonType,
      workoutCount: entries.length
    };
  };

  const additionalStats = calculateAdditionalStats();

  const statsCards = [
    {
      title: 'Total Workouts',
      value: weeklyStats?.totalWorkouts || additionalStats.workoutCount || 0,
      change: weeklyStats?.workoutsChange || '+0%',
      icon: Activity,
      color: 'blue',
      description: 'This week',
      trend: weeklyStats?.workoutsChange?.startsWith('+') ? 'up' : 'down'
    },
    {
      title: 'Calories Burned',
      value: weeklyStats?.caloriesBurned || additionalStats.totalCalories || 0,
      change: weeklyStats?.caloriesChange || '+0%',
      icon: Flame,
      color: 'red',
      description: 'This week',
      trend: weeklyStats?.caloriesChange?.startsWith('+') ? 'up' : 'down'
    },
    {
      title: 'Total Duration',
      value: `${weeklyStats?.totalDuration || additionalStats.totalDuration || 0}`,
      change: weeklyStats?.durationChange || '+0%',
      icon: Clock,
      color: 'green',
      description: 'Minutes this week',
      trend: weeklyStats?.durationChange?.startsWith('+') ? 'up' : 'down',
      unit: 'min'
    },
    {
      title: 'Weekly Goal',
      value: `${weeklyStats?.weeklyGoal || 0}`,
      change: weeklyStats?.goalChange || '+0%',
      icon: Target,
      color: 'orange',
      description: '5 workouts per week',
      trend: weeklyStats?.goalChange?.startsWith('+') ? 'up' : 'down',
      unit: '%'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      gradient: 'from-red-500 to-red-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Main Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl ml-3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasData = entries && entries.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border border-gray-200/60">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Workout Data</h3>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Start logging your workouts to see detailed statistics and track your progress.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Log First Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Activity size={20} className="text-blue-600" />
            </div>
            Workout Statistics
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Overview of your fitness activities and progress
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <Calendar size={16} />
          <span>This Week</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, index) => {
          const colorClass = colorClasses[stat.color] || colorClasses.blue;
          const isPositive = stat.trend === 'up';
          
          return (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                    {stat.title}
                  </p>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                      {stat.value}
                    </p>
                    {stat.unit && (
                      <span className="text-sm font-medium text-gray-500">
                        {stat.unit}
                      </span>
                    )}
                  </div>

                  {/* Change Indicator */}
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isPositive 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {isPositive ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      <span>{stat.change}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      from last week
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {stat.description}
                  </p>
                </div>

                {/* Icon */}
                <div className={`p-3 rounded-xl ${colorClass.bg} border ${colorClass.border} group-hover:scale-110 transition-transform duration-200 flex-shrink-0 ml-3`}>
                  <stat.icon size={20} className={colorClass.text} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: isPositive ? '75%' : '25%' 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Average Duration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Duration</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {additionalStats.avgDuration || 0}
                <span className="text-sm font-normal text-gray-500 ml-1">minutes</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Per workout session
          </p>
        </div>
        
        {/* Total Calories */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Flame size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {additionalStats.totalCalories?.toLocaleString() || 0}
                <span className="text-sm font-normal text-gray-500 ml-1">cal</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            All time total
          </p>
        </div>
        
        {/* Most Common Type */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Workout</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 capitalize">
                {additionalStats.mostCommonType || 'None'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Most frequent activity
          </p>
        </div>
      </div>

      {/* Summary Footer - Removed the button */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200/60">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
            Workout Summary
          </h4>
          <p className="text-gray-600 text-sm">
            {additionalStats.workoutCount || 0} workouts completed • {additionalStats.totalDuration || 0} total minutes • {additionalStats.totalCalories?.toLocaleString() || 0} calories burned
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;