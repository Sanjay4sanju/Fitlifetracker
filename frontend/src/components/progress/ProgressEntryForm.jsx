import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import Button from '../common/Button';
import Input from '../common/Input';

const ProgressEntryForm = ({ onSubmit, loading, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      progressDate: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const moods = [
    { value: 'very_poor', label: 'Very Poor' },
    { value: 'poor', label: 'Poor' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'good', label: 'Good' },
    { value: 'excellent', label: 'Excellent' }
  ];

  const energyLevels = [
    { value: 'very_low', label: 'Very Low' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'very_high', label: 'Very High' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date *"
          type="date"
          {...register('progressDate', { required: 'Date is required' })}
          error={errors.progressDate?.message}
        />

        <Input
          label="Weight (kg) *"
          type="number"
          step="0.1"
          min="30"
          max="300"
          {...register('weight', { 
            required: 'Weight is required',
            min: { value: 30, message: 'Weight must be at least 30kg' },
            max: { value: 300, message: 'Weight must be less than 300kg' }
          })}
          error={errors.weight?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Body Fat Percentage"
          type="number"
          step="0.1"
          min="5"
          max="50"
          {...register('bodyFatPercentage', {
            min: { value: 5, message: 'Body fat percentage must be at least 5%' },
            max: { value: 50, message: 'Body fat percentage must be less than 50%' }
          })}
          error={errors.bodyFatPercentage?.message}
        />

        <Input
          label="Muscle Mass (kg)"
          type="number"
          step="0.1"
          min="0"
          {...register('muscleMass')}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Waist (cm)"
          type="number"
          step="0.1"
          min="0"
          {...register('waistCircumference')}
        />
        <Input
          label="Chest (cm)"
          type="number"
          step="0.1"
          min="0"
          {...register('chestCircumference')}
        />
        <Input
          label="Arm (cm)"
          type="number"
          step="0.1"
          min="0"
          {...register('armCircumference')}
        />
        <Input
          label="Thigh (cm)"
          type="number"
          step="0.1"
          min="0"
          {...register('thighCircumference')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood
          </label>
          <select
            {...register('mood')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select mood</option>
            {moods.map(mood => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Energy Level
          </label>
          <select
            {...register('energyLevel')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select energy level</option>
            {energyLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Any observations about your progress, challenges, or achievements..."
        />
      </div>

      {/* Fixed button container */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-6 py-2"
        >
          {loading ? 'Saving...' : 'Save Measurement'}
        </Button>
      </div>
    </form>
  );
};

export default ProgressEntryForm;