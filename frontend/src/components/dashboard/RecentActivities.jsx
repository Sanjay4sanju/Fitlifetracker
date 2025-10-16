import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Clock, 
  MoreVertical,
  Flame,
  Timer,
  Weight,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';

const RecentActivities = ({ activities = [], loading = false, maxItems = 5 }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleExpand = (activityId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityIcon = (type) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'nutrition':
        return <Utensils {...iconProps} className="text-green-600" />;
      case 'workout':
        return <Dumbbell {...iconProps} className="text-blue-600" />;
      case 'progress':
        return <TrendingUp {...iconProps} className="text-purple-600" />;
      default:
        return <Activity {...iconProps} className="text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'nutrition':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'workout':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'progress':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'nutrition':
        return `Logged ${activity.foodName || 'food'}`;
      case 'workout':
        return `Completed ${activity.activityName || 'workout'}`;
      case 'progress':
        return `Recorded weight measurement`;
      default:
        return 'Completed an activity';
    }
  };

  const getActivityMetrics = (activity) => {
    switch (activity.type) {
      case 'nutrition':
        return [
          { icon: Flame, label: 'Calories', value: `${Math.round(activity.calories || 0)} cal`, color: 'text-orange-500' },
          { icon: Weight, label: 'Protein', value: `${Math.round(activity.protein || 0)}g`, color: 'text-blue-500' },
          { icon: TrendingUp, label: 'Carbs', value: `${Math.round(activity.carbohydrates || 0)}g`, color: 'text-green-500' },
          { icon: Flame, label: 'Fat', value: `${Math.round(activity.fat || 0)}g`, color: 'text-yellow-500' }
        ];
      case 'workout':
        return [
          { icon: Flame, label: 'Burned', value: `${Math.round(activity.caloriesBurned || 0)} cal`, color: 'text-red-500' },
          { icon: Timer, label: 'Duration', value: `${activity.duration || 0} min`, color: 'text-blue-500' },
          { icon: Activity, label: 'Type', value: activity.workoutType || 'General', color: 'text-purple-500' }
        ];
      case 'progress':
        return [
          { icon: Weight, label: 'Weight', value: `${activity.weight || 0} kg`, color: 'text-gray-500' },
          { icon: TrendingUp, label: 'Change', value: activity.change ? `${activity.change > 0 ? '+' : ''}${activity.change} kg` : 'N/A', color: activity.change > 0 ? 'text-red-500' : activity.change < 0 ? 'text-green-500' : 'text-gray-500' }
        ];
      default:
        return [];
    }
  };

  const displayedActivities = showAll ? activities : activities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60">
        <div className="p-4 sm:p-6 border-b border-gray-200/60">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200/60">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60">
        <div className="p-4 sm:p-6 border-b border-gray-200/60">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={20} />
            Recent Activities
          </h3>
          <p className="text-sm text-gray-500 mt-1">Your latest fitness and nutrition updates</p>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium mb-2">No recent activities</p>
          <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
            Start logging your workouts, meals, and progress to see your activities here.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Log Workout
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Add Meal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Activity size={20} />
              Recent Activities
            </h3>
            <p className="text-sm text-gray-500 mt-1">Your latest fitness and nutrition updates</p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {activities.length} total
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-200/60">
        {displayedActivities.map((activity) => {
          const metrics = getActivityMetrics(activity);
          const isExpanded = expandedItems.has(activity.id);
          const mainMetric = metrics[0];

          return (
            <div 
              key={activity.id} 
              className="p-4 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
              onClick={() => toggleExpand(activity.id)}
            >
              {/* Main Activity Row */}
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-xl border ${getActivityColor(activity.type)} flex-shrink-0 mt-1`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Main Metric */}
                    {mainMetric && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <mainMetric.icon size={16} className={mainMetric.color} />
                          <span>{mainMetric.value}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Metrics */}
                  {isExpanded && metrics.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-200/60">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        {metrics.slice(1).map((metric, index) => (
                          <div key={index} className="text-center">
                            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                              <metric.icon size={12} className={metric.color} />
                              <span>{metric.label}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info for Mobile */}
              {!isExpanded && activity.notes && (
                <div className="mt-2 pl-11">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {activity.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {activities.length > maxItems && (
        <div className="p-4 border-t border-gray-200/60">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show {activities.length - maxItems} More Activities
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-gray-200/60 bg-gray-50/50 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row gap-2 text-xs">
          <div className="flex items-center gap-4 text-gray-600 flex-1">
            <span>Last updated: {format(new Date(), 'MMM d, HH:mm')}</span>
          </div>
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Log Workout
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Add Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;