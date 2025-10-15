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

  // Get dashboard data with weekly comparisons
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsAPI.getWeeklyComparisons(),
  });

  // Get detailed data for calculations
  const { data: workoutData } = useQuery({
    queryKey: ['workouts-dashboard'],
    queryFn: () => workoutAPI.getEntries({ limit: 100 })
  });

  const { data: nutritionData } = useQuery({
    queryKey: ['nutrition-dashboard'],
    queryFn: () => nutritionAPI.getEntries({ limit: 100 })
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress-dashboard'],
    queryFn: () => progressAPI.getEntries({ limit: 100 })
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex items-center justify-center h-64">
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

  // Calculate real statistics from database
  const calculateRealStats = () => {
    // Get current week and previous week dates
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setDate(currentWeekStart.getDate() - 1);

    // Filter workouts by week
    const currentWeekWorkouts = workoutData?.entries?.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= currentWeekStart;
    }) || [];

    const previousWeekWorkouts = workoutData?.entries?.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= previousWeekStart && workoutDate < currentWeekStart;
    }) || [];

    // Filter nutrition entries by week
    const currentWeekNutrition = nutritionData?.entries?.filter(nutrition => {
      const nutritionDate = new Date(nutrition.dateConsumed);
      return nutritionDate >= currentWeekStart;
    }) || [];

    const previousWeekNutrition = nutritionData?.entries?.filter(nutrition => {
      const nutritionDate = new Date(nutrition.dateConsumed);
      return nutritionDate >= previousWeekStart && nutritionDate < currentWeekStart;
    }) || [];

    // Calculate totals
    const totalWorkoutsCurrent = currentWeekWorkouts.length;
    const totalWorkoutsPrevious = previousWeekWorkouts.length;
    const workoutsChange = totalWorkoutsPrevious > 0 
      ? ((totalWorkoutsCurrent - totalWorkoutsPrevious) / totalWorkoutsPrevious * 100).toFixed(0)
      : totalWorkoutsCurrent > 0 ? 100 : 0;

    const caloriesCurrent = currentWeekWorkouts.reduce((sum, workout) => 
      sum + (parseFloat(workout.caloriesBurned) || 0), 0);
    const caloriesPrevious = previousWeekWorkouts.reduce((sum, workout) => 
      sum + (parseFloat(workout.caloriesBurned) || 0), 0);
    const caloriesChange = caloriesPrevious > 0 
      ? ((caloriesCurrent - caloriesPrevious) / caloriesPrevious * 100).toFixed(0)
      : caloriesCurrent > 0 ? 100 : 0;

    const nutritionCurrent = currentWeekNutrition.length;
    const nutritionPrevious = previousWeekNutrition.length;
    const nutritionChange = nutritionPrevious > 0 
      ? ((nutritionCurrent - nutritionPrevious) / nutritionPrevious * 100).toFixed(0)
      : nutritionCurrent > 0 ? 100 : 0;

    // Calculate goal progress based on actual progress data
    const calculateGoalProgress = () => {
      if (!progressData?.entries?.length) return { progress: 0, change: 0 };
      
      const sortedProgress = progressData.entries.sort((a, b) => 
        new Date(b.progressDate) - new Date(a.progressDate));
      
      if (sortedProgress.length < 2) return { progress: 25, change: 0 };
      
      const latest = sortedProgress[0];
      const previous = sortedProgress[1];
      
      let progress = 50; // Default progress
      let change = 5; // Default change
      
      if (user?.fitnessGoal === 'weight_loss' && previous.weight && latest.weight) {
        const targetWeight = user.targetWeight || (previous.weight * 0.9); // 10% weight loss goal
        progress = Math.max(0, Math.min(100, 
          ((previous.weight - latest.weight) / (previous.weight - targetWeight)) * 100
        ));
        
        // Calculate weekly progress change
        const weeklyProgress = sortedProgress.slice(0, 4); // Last 4 entries
        if (weeklyProgress.length >= 2) {
          const recentProgress = ((weeklyProgress[0].weight - weeklyProgress[1].weight) / weeklyProgress[1].weight) * 100;
          change = Math.max(0, Math.min(100, recentProgress * 10)); // Scale for percentage
        }
      }
      
      return { progress: Math.round(progress), change: Math.round(change) };
    };

    const goalProgress = calculateGoalProgress();

    return {
      totalWorkouts: totalWorkoutsCurrent,
      workoutsChange: `${workoutsChange > 0 ? '+' : ''}${workoutsChange}%`,
      
      caloriesBurned: Math.round(caloriesCurrent),
      caloriesChange: `${caloriesChange > 0 ? '+' : ''}${caloriesChange}%`,
      
      nutritionEntries: nutritionCurrent,
      nutritionChange: `${nutritionChange > 0 ? '+' : ''}${nutritionChange}%`,
      
      goalProgress: goalProgress.progress,
      goalChange: `${goalProgress.change > 0 ? '+' : ''}${goalProgress.change}%`
    };
  };

  const statsData = calculateRealStats();

  const stats = [
    {
      title: 'Total Workouts',
      value: statsData.totalWorkouts,
      change: statsData.workoutsChange,
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Calories Burned',
      value: statsData.caloriesBurned,
      change: statsData.caloriesChange,
      icon: Flame,
      color: 'red'
    },
    {
      title: 'Nutrition Entries',
      value: statsData.nutritionEntries,
      change: statsData.nutritionChange,
      icon: Utensils,
      color: 'purple'
    },
    {
      title: 'Goal Progress',
      value: `${statsData.goalProgress}%`,
      change: statsData.goalChange,
      icon: Target,
      color: 'orange'
    }
  ];

  // Combine recent activities from all sources
  const recentActivities = [
    ...(workoutData?.entries?.map(w => ({ 
      ...w, 
      id: w.id,
      type: 'workout', 
      timestamp: w.datePerformed,
      title: w.activityName,
      description: `${w.duration}min • ${w.caloriesBurned} cal`
    })) || []),
    ...(nutritionData?.entries?.map(n => ({ 
      ...n, 
      id: n.id,
      type: 'nutrition', 
      timestamp: n.dateConsumed,
      title: n.foodName,
      description: `${n.mealType} • ${n.calories} cal`
    })) || []),
    ...(progressData?.entries?.map(p => ({ 
      ...p, 
      id: p.id,
      type: 'progress', 
      timestamp: p.progressDate,
      title: `Weight: ${p.weight}kg`,
      description: p.bodyFatPercentage ? `Body Fat: ${p.bodyFatPercentage}%` : 'Progress update'
    })) || [])
  ]
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  .slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || 'User'}! 👋 
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {user?.fitnessGoal ? 
            `You're making great progress on your ${user.fitnessGoal.replace('_', ' ')} journey.` :
            'Track your fitness and nutrition to achieve your goals.'
          }
        </p>
        {(user?.weight || user?.height) && (
          <div className="flex items-center space-x-4 mt-3 text-primary-200 text-sm">
            {user?.weight && (
              <>
                <Scale size={16} />
                <span>Weight: {user.weight}kg</span>
              </>
            )}
            {user?.height && (
              <>
                <Heart size={16} />
                <span>Height: {user.height}cm</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="min-h-[300px]">
          <NutritionChart data={nutritionData} />
        </div>
        <div className="min-h-[300px]">
          <WorkoutChart data={workoutData} />
        </div>
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} />
    </div>
  );
};

export default Dashboard;