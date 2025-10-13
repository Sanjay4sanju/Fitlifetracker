import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Utensils, Dumbbell, TrendingUp, Clock } from 'lucide-react';

const RecentActivities = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'nutrition':
        return <Utensils size={16} className="text-green-500" />;
      case 'workout':
        return <Dumbbell size={16} className="text-blue-500" />;
      case 'progress':
        return <TrendingUp size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'nutrition':
        return `Logged ${activity.foodName || 'food'} (${Math.round(activity.calories || 0)} cal)`;
      case 'workout':
        return `Completed ${activity.activityName || 'workout'} for ${activity.duration || 0} min`;
      case 'progress':
        return `Recorded weight: ${activity.weight || 0} kg`;
      default:
        return 'Completed an activity';
    }
  };

  const getActivityMetrics = (activity) => {
    switch (activity.type) {
      case 'nutrition':
        return { calories: activity.calories };
      case 'workout':
        return { 
          caloriesBurned: activity.caloriesBurned, 
          duration: activity.duration 
        };
      case 'progress':
        return { weight: activity.weight };
      default:
        return {};
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No recent activities found.</p>
          <p className="text-sm">Start logging your workouts and nutrition to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => {
          const metrics = getActivityMetrics(activity);
          return (
            <div key={activity.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                {metrics.calories && (
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round(metrics.calories)} cal
                  </p>
                )}
                {metrics.caloriesBurned && (
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round(metrics.caloriesBurned)} cal
                  </p>
                )}
                {metrics.duration && (
                  <p className="text-sm text-gray-500">
                    {metrics.duration} min
                  </p>
                )}
                {metrics.weight && (
                  <p className="text-sm font-medium text-gray-900">
                    {metrics.weight} kg
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;