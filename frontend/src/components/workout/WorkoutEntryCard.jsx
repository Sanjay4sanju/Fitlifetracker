import React from 'react';
import { format } from 'date-fns';
import { Clock, Flame, Activity, TrendingUp, Dumbbell } from 'lucide-react';

const WorkoutEntryCard = ({ workout, onEdit, onDelete }) => {
  const getWorkoutTypeIcon = (type) => {
    const icons = {
      cardio: Activity,
      strength: Dumbbell,
      flexibility: TrendingUp,
      sports: Flame,
      other: Clock
    };
    const Icon = icons[type] || Clock;
    return <Icon size={16} />;
  };

  const getWorkoutTypeColor = (type) => {
    const colors = {
      cardio: 'bg-red-100 text-red-800',
      strength: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      low: 'text-green-600',
      moderate: 'text-yellow-600',
      high: 'text-orange-600',
      very_high: 'text-red-600'
    };
    return colors[intensity] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getWorkoutTypeColor(workout.workoutType)}`}>
            {getWorkoutTypeIcon(workout.workoutType)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{workout.activityName}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {workout.workoutType.replace('_', ' ')} • 
              <span className={`ml-1 font-medium ${getIntensityColor(workout.intensity)}`}>
                {workout.intensity.replace('_', ' ')} intensity
              </span>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors duration-200">
              <Clock size={14} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors duration-200"
            >
              <Flame size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock size={20} className="mx-auto text-gray-400 mb-1" />
          <div className="text-lg font-bold text-gray-900">{workout.duration}</div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Flame size={20} className="mx-auto text-orange-400 mb-1" />
          <div className="text-lg font-bold text-gray-900">{workout.caloriesBurned}</div>
          <div className="text-xs text-gray-500">Calories</div>
        </div>

        {workout.distance && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Activity size={20} className="mx-auto text-blue-400 mb-1" />
            <div className="text-lg font-bold text-gray-900">{workout.distance}</div>
            <div className="text-xs text-gray-500">{workout.distanceUnit || 'km'}</div>
          </div>
        )}

        {workout.heartRateAvg && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp size={20} className="mx-auto text-red-400 mb-1" />
            <div className="text-lg font-bold text-gray-900">{workout.heartRateAvg}</div>
            <div className="text-xs text-gray-500">Avg BPM</div>
          </div>
        )}
      </div>

      {(workout.sets || workout.reps || workout.weight) && (
        <div className="flex space-x-4 mb-3">
          {workout.sets && (
            <span className="text-sm text-gray-600">Sets: {workout.sets}</span>
          )}
          {workout.reps && (
            <span className="text-sm text-gray-600">Reps: {workout.reps}</span>
          )}
          {workout.weight && (
            <span className="text-sm text-gray-600">Weight: {workout.weight}{workout.weightUnit || 'kg'}</span>
          )}
        </div>
      )}

      {workout.notes && (
        <p className="text-sm text-gray-600 mb-3">{workout.notes}</p>
      )}

      <div className="text-xs text-gray-500">
        {format(new Date(workout.datePerformed), 'MMM d, yyyy • HH:mm')}
      </div>
    </div>
  );
};

export default WorkoutEntryCard;