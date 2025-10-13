import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log('Form submission data:', data);
    try {
      const response = await registerUser(data);
      if (response.success) {
        alert('Account created successfully!');
        // Optionally redirect to login
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const password = watch('password', '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register('firstName', { 
            required: 'First name is required',
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'First name can only contain letters and spaces'
            },
            minLength: {
              value: 2,
              message: 'First name must be at least 2 characters'
            }
          })}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          {...register('lastName', { 
            required: 'Last name is required',
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'Last name can only contain letters and spaces'
            },
            minLength: {
              value: 2,
              message: 'Last name must be at least 2 characters'
            }
          })}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Username"
        {...register('username', { 
          required: 'Username is required',
          pattern: {
            value: /^[a-zA-Z0-9._-]+$/,
            message: 'Username can only contain letters, numbers, underscores, dots, and hyphens'
          },
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters'
          },
          maxLength: {
            value: 30,
            message: 'Username must be less than 30 characters'
          }
        })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: value => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Height (cm)"
          type="number"
          step="0.1"
          {...register('height', { 
            required: 'Height is required',
            min: { value: 100, message: 'Height must be at least 100cm' },
            max: { value: 250, message: 'Height must be less than 250cm' }
          })}
          error={errors.height?.message}
        />

        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          {...register('weight', { 
            required: 'Weight is required',
            min: { value: 30, message: 'Weight must be at least 30kg' },
            max: { value: 300, message: 'Weight must be less than 300kg' }
          })}
          error={errors.weight?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-xs mt-1">{errors.gender.message}</p>
          )}
        </div>

        <Input
          label="Date of Birth"
          type="date"
          {...register('dateOfBirth', { required: 'Date of Birth is required' })}
          error={errors.dateOfBirth?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
          <select
            {...register('fitnessGoal', { required: 'Fitness Goal is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="maintenance">Maintenance</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="endurance">Endurance</option>
          </select>
          {errors.fitnessGoal && (
            <p className="text-red-600 text-xs mt-1">{errors.fitnessGoal.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
          <select
            {...register('activityLevel', { required: 'Activity Level is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="moderate">Moderate</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
          {errors.activityLevel && (
            <p className="text-red-600 text-xs mt-1">{errors.activityLevel.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;