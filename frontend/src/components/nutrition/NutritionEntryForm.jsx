import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';

const NutritionEntryForm = ({ onSubmit, loading, onCancel, selectedDate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Food Name *"
          {...register('foodName', { required: 'Food name is required' })}
          error={errors.foodName?.message}
          placeholder="e.g., Chicken Breast, Apple, etc."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type *
          </label>
          <select
            {...register('mealType', { required: 'Meal type is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select meal type</option>
            {mealTypes.map(meal => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
          {errors.mealType && (
            <p className="text-sm text-red-600 mt-1">{errors.mealType.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Calories *"
          type="number"
          step="0.1"
          min="0"
          {...register('calories', { 
            required: 'Calories are required',
            min: { value: 0, message: 'Calories must be positive' }
          })}
          error={errors.calories?.message}
        />

        <Input
          label="Protein (g) *"
          type="number"
          step="0.1"
          min="0"
          {...register('protein', { 
            required: 'Protein is required',
            min: { value: 0, message: 'Protein must be positive' }
          })}
          error={errors.protein?.message}
        />

        <Input
          label="Carbs (g) *"
          type="number"
          step="0.1"
          min="0"
          {...register('carbohydrates', { 
            required: 'Carbohydrates are required',
            min: { value: 0, message: 'Carbs must be positive' }
          })}
          error={errors.carbohydrates?.message}
        />

        <Input
          label="Fats (g) *"
          type="number"
          step="0.1"
          min="0"
          {...register('fats', { 
            required: 'Fats are required',
            min: { value: 0, message: 'Fats must be positive' }
          })}
          error={errors.fats?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Portion Size"
          type="number"
          step="0.1"
          min="0"
          {...register('portionSize', { min: 0 })}
          error={errors.portionSize?.message}
        />

        <Input
          label="Portion Unit"
          placeholder="e.g., serving, cup, gram"
          {...register('portionUnit')}
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
          placeholder="Any additional notes about this food entry..."
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
          {loading ? 'Adding Entry...' : 'Add Entry'}
        </Button>
      </div>
    </form>
  );
};

export default NutritionEntryForm;