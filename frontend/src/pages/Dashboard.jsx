import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, workoutAPI, nutritionAPI, progressAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/dashboard/StatsCard';
import NutritionChart from '../components/dashboard/NutritionChart';
import WorkoutChart from '../components/dashboard/WorkoutChart';
import RecentActivities from '../components/dashboard/RecentActivities';
import { Activity, Utensils, TrendingUp, Target, Flame, Heart, Scale } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsAPI.getWeeklyComparisons(),
  });

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Workouts',
      value: '12',
      change: '+20%',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Calories Burned',
      value: '3,456',
      change: '+15%',
      icon: Flame,
      color: 'red'
    },
    {
      title: 'Nutrition Entries',
      value: '28',
      change: '+8%',
      icon: Utensils,
      color: 'purple'
    },
    {
      title: 'Goal Progress',
      value: '75%',
      change: '+5%',
      icon: Target,
      color: 'orange'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋 
            </h1>
            <p className="text-primary-100 text-sm sm:text-base opacity-90">
              {user?.fitnessGoal ? 
                `You're making great progress on your ${user.fitnessGoal.replace('_', ' ')} journey.` :
                'Track your fitness and nutrition to achieve your goals.'
              }
            </p>
            {(user?.weight || user?.height) && (
              <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-3 text-primary-200 text-xs sm:text-sm">
                {user?.weight && (
                  <div className="flex items-center gap-1">
                    <Scale size={14} />
                    <span>Weight: {user.weight}kg</span>
                  </div>
                )}
                {user?.height && (
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>Height: {user.height}cm</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <NutritionChart data={{ entries: [] }} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <WorkoutChart data={{ entries: [] }} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <RecentActivities activities={[]} />
      </div>
    </div>
  );
};

export default Dashboard;