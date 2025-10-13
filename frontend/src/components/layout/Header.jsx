import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Menu, Dumbbell, Utensils, TrendingUp, Target, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { workoutAPI, nutritionAPI, progressAPI } from '../../services/api';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch data for notifications
  const { data: workoutData } = useQuery({
    queryKey: ['workouts-notifications'],
    queryFn: () => workoutAPI.getEntries({ limit: 50 })
  });

  const { data: nutritionData } = useQuery({
    queryKey: ['nutrition-notifications'],
    queryFn: () => nutritionAPI.getEntries({ limit: 50 })
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress-notifications'],
    queryFn: () => progressAPI.getEntries({ limit: 10 })
  });

  // Generate realistic notifications based on user data
  const generateNotifications = () => {
    const notifications = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if user has logged workout today
    const hasWorkoutToday = workoutData?.entries?.some(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= today;
    });

    if (!hasWorkoutToday) {
      notifications.push({
        id: 'workout-reminder',
        type: 'reminder',
        icon: Dumbbell,
        title: 'Time for a workout!',
        message: "You haven't logged any exercise today. Stay consistent!",
        time: 'Just now',
        priority: 'high',
        unread: true
      });
    }

    // Check nutrition balance
    const todayNutrition = nutritionData?.entries?.filter(nutrition => {
      const nutritionDate = new Date(nutrition.dateConsumed);
      return nutritionDate >= today;
    }) || [];

    const totalCalories = todayNutrition.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0);
    const totalProtein = todayNutrition.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0);

    if (totalCalories > 0 && totalProtein < 50) {
      notifications.push({
        id: 'protein-reminder',
        type: 'nutrition',
        icon: Utensils,
        title: 'Protein Intake Low',
        message: `You've consumed ${totalProtein}g protein today. Aim for at least 50g.`,
        time: '15 min ago',
        priority: 'medium',
        unread: true
      });
    }

    // Progress tracking reminder (if no progress in 7 days)
    const lastProgress = progressData?.entries?.[0];
    if (lastProgress) {
      const lastProgressDate = new Date(lastProgress.progressDate);
      const daysSinceProgress = Math.floor((now - lastProgressDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceProgress >= 7) {
        notifications.push({
          id: 'progress-reminder',
          type: 'progress',
          icon: TrendingUp,
          title: 'Progress Check',
          message: `It's been ${daysSinceProgress} days since your last progress update.`,
          time: '1 hour ago',
          priority: 'medium',
          unread: true
        });
      }
    }

    // Weekly goal achievement
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weeklyWorkouts = workoutData?.entries?.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= weekStart;
    }) || [];

    if (weeklyWorkouts.length >= 3) {
      notifications.push({
        id: 'weekly-goal',
        type: 'achievement',
        icon: Target,
        title: 'Weekly Goal Achieved!',
        message: `Great job! You've completed ${weeklyWorkouts.length} workouts this week.`,
        time: '2 hours ago',
        priority: 'low',
        unread: true
      });
    }

    // Consistency streak
    const last7DaysWorkouts = workoutData?.entries?.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }) || [];

    if (last7DaysWorkouts.length >= 5) {
      notifications.push({
        id: 'consistency-streak',
        type: 'achievement',
        icon: Clock,
        title: 'Consistency Streak!',
        message: 'You have worked out 5+ times in the last 7 days. Keep it up!',
        time: '3 hours ago',
        priority: 'low',
        unread: true
      });
    }

    return notifications;
  };

  const notifications = generateNotifications();
  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reminder': return '🔔';
      case 'nutrition': return '🍎';
      case 'progress': return '📊';
      case 'achievement': return '🏆';
      default: return '💡';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search workouts, nutrition..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <div className="relative notification-dropdown">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-lg">{getTypeIcon(notification.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {notification.message}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">{notification.time}</span>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 text-sm">No notifications yet</p>
                      <p className="text-gray-400 text-xs">Your alerts will appear here</p>
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 py-2">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.fitnessGoal?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                    <span>Height: {user?.height}cm</span>
                    <span>•</span>
                    <span>Weight: {user?.weight}kg</span>
                  </div>
                </div>
                <div className="p-2">
                 
                  
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;