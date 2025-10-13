import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Dumbbell } from 'lucide-react';
import { workoutAPI } from '../services/api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import WorkoutEntryForm from '../components/workout/WorkoutEntryForm';
import WorkoutEntryCard from '../components/workout/WorkoutEntryCard';
import WorkoutStats from '../components/workout/WorkoutStats';

const Workouts = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    workoutType: '',
    intensity: ''
  });

  const queryClient = useQueryClient();

  const { data: workoutData, isLoading, error } = useQuery({
    queryKey: ['workouts', selectedDate, filters],
    queryFn: () => workoutAPI.getEntries({
      date: selectedDate || undefined,
      workoutType: filters.workoutType || undefined,
      page: 1,
      limit: 100
    })
  });

  const { data: statsData } = useQuery({
    queryKey: ['workout-stats'],
    queryFn: () => workoutAPI.getStats({
      days: 30
    })
  });

  const { data: weeklyComparison } = useQuery({
    queryKey: ['workout-weekly-comparison'],
    queryFn: () => workoutAPI.getWeeklyComparison()
  });

  const addMutation = useMutation({
    mutationFn: workoutAPI.addEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['workout-stats']);
      queryClient.invalidateQueries(['workout-weekly-comparison']);
      queryClient.invalidateQueries(['dashboard']);
      setShowAddModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: workoutAPI.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['workout-stats']);
      queryClient.invalidateQueries(['workout-weekly-comparison']);
      queryClient.invalidateQueries(['dashboard']);
    }
  });

  // Calculate real weekly comparisons
  const calculateWeeklyStats = () => {
    if (!workoutData?.entries) return {};

    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setDate(currentWeekStart.getDate() - 1);

    // Filter workouts by week
    const currentWeekWorkouts = workoutData.entries.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= currentWeekStart;
    });

    const previousWeekWorkouts = workoutData.entries.filter(workout => {
      const workoutDate = new Date(workout.datePerformed);
      return workoutDate >= previousWeekStart && workoutDate < currentWeekStart;
    });

    // Calculate metrics
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

    const durationCurrent = currentWeekWorkouts.reduce((sum, workout) => 
      sum + (parseInt(workout.duration) || 0), 0);
    const durationPrevious = previousWeekWorkouts.reduce((sum, workout) => 
      sum + (parseInt(workout.duration) || 0), 0);
    const durationChange = durationPrevious > 0 
      ? ((durationCurrent - durationPrevious) / durationPrevious * 100).toFixed(0)
      : durationCurrent > 0 ? 100 : 0;

    // Calculate weekly goal progress (assuming 5 workouts per week goal)
    const weeklyGoal = 5;
    const weeklyGoalProgress = Math.min(100, (totalWorkoutsCurrent / weeklyGoal) * 100);
    const previousWeekGoalProgress = Math.min(100, (totalWorkoutsPrevious / weeklyGoal) * 100);
    const goalChange = previousWeekGoalProgress > 0 
      ? ((weeklyGoalProgress - previousWeekGoalProgress) / previousWeekGoalProgress * 100).toFixed(0)
      : weeklyGoalProgress > 0 ? 100 : 0;

    return {
      totalWorkouts: totalWorkoutsCurrent,
      workoutsChange: `${workoutsChange > 0 ? '+' : ''}${workoutsChange}%`,
      
      caloriesBurned: Math.round(caloriesCurrent),
      caloriesChange: `${caloriesChange > 0 ? '+' : ''}${caloriesChange}%`,
      
      totalDuration: durationCurrent,
      durationChange: `${durationChange > 0 ? '+' : ''}${durationChange}%`,
      
      weeklyGoal: Math.round(weeklyGoalProgress),
      goalChange: `${goalChange > 0 ? '+' : ''}${goalChange}%`
    };
  };

  const weeklyStats = calculateWeeklyStats();

  const handleAddWorkout = async (data) => {
    const workoutDate = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();
    await addMutation.mutateAsync({
      ...data,
      datePerformed: workoutDate
    });
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const workoutTypes = [
    { value: '', label: 'All Workouts' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const intensityLevels = [
    { value: '', label: 'All Intensities' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very_high', label: 'Very High' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    console.error('Workouts page error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading workout data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workout Tracking</h1>
          <p className="text-gray-600">Log your exercises and track your fitness progress</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Workout</span>
        </Button>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutStats 
            stats={statsData} 
            entries={workoutData?.entries}
            weeklyStats={weeklyStats}
          />
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date (Optional)
              </label>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to show all workouts</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
              </label>
              <select
                value={filters.workoutType}
                onChange={(e) => setFilters(prev => ({ ...prev, workoutType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {workoutTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intensity
              </label>
              <select
                value={filters.intensity}
                onChange={(e) => setFilters(prev => ({ ...prev, intensity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {intensityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Entries */}
      <div className="space-y-4">
        {workoutData?.entries?.map(workout => (
          <WorkoutEntryCard
            key={workout.id}
            workout={workout}
            onDelete={() => handleDeleteWorkout(workout.id)}
          />
        ))}
        
        {(!workoutData?.entries || workoutData.entries.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Dumbbell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {workoutData?.entries?.length === 0 ? 'No workouts recorded' : 'No workouts match your filters'}
            </h3>
            <p className="text-gray-500">
              {workoutData?.entries?.length === 0 
                ? 'Start tracking your workouts by adding your first entry.'
                : 'Try changing your filters to see more workouts.'
              }
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="mt-4"
            >
              Add First Workout
            </Button>
          </div>
        )}
      </div>

      {/* Add Workout Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Workout Entry"
        size="lg"
      >
        <WorkoutEntryForm
          onSubmit={handleAddWorkout}
          loading={addMutation.isLoading}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Workouts;