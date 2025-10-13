import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';

const WorkoutEntryForm = ({ onSubmit, loading, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [workoutType, setWorkoutType] = useState('cardio');

  const workoutTypes = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const intensityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very_high', label: 'Very High' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Activity Name"
          {...register('activityName', { required: 'Activity name is required' })}
          error={errors.activityName?.message}
          placeholder="e.g., Running, Weight Lifting, Yoga"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workout Type
          </label>
          <select
            {...register('workoutType', { required: 'Workout type is required' })}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {workoutTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.workoutType && (
            <p className="text-sm text-red-600 mt-1">{errors.workoutType.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duration (minutes)"
          type="number"
          {...register('duration', { 
            required: 'Duration is required',
            min: { value: 1, message: 'Duration must be at least 1 minute' }
          })}
          error={errors.duration?.message}
        />

        <Input
          label="Calories Burned"
          type="number"
          step="0.1"
          {...register('caloriesBurned', { 
            required: 'Calories burned is required',
            min: { value: 0, message: 'Calories must be positive' }
          })}
          error={errors.caloriesBurned?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intensity Level
          </label>
          <select
            {...register('intensity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {intensityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {workoutType === 'cardio' && (
          <Input
            label="Distance"
            type="number"
            step="0.1"
            {...register('distance')}
            placeholder="Distance in km or miles"
          />
        )}
      </div>

      {workoutType === 'strength' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Sets"
            type="number"
            {...register('sets')}
            placeholder="Number of sets"
          />
          <Input
            label="Reps"
            type="number"
            {...register('reps')}
            placeholder="Reps per set"
          />
          <Input
            label="Weight"
            type="number"
            step="0.1"
            {...register('weight')}
            placeholder="Weight used"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Average Heart Rate"
          type="number"
          {...register('heartRateAvg')}
          placeholder="Average BPM"
        />
        <Input
          label="Max Heart Rate"
          type="number"
          {...register('heartRateMax')}
          placeholder="Max BPM"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="How did the workout feel? Any challenges or achievements?"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          Add Workout
        </Button>
      </div>
    </form>
  );
};

export default WorkoutEntryForm;