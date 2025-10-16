import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading, error, clearError } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    
    // Set default values
    setValue('fitnessGoal', 'maintenance');
    setValue('activityLevel', 'moderate');
    setValue('gender', 'other');
    
    // Set a default date of birth (18 years ago)
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    setValue('dateOfBirth', defaultDate.toISOString().split('T')[0]);
  }, []);

  const onSubmit = async (formData) => {
    console.log('Form submission data:', formData);
    
    // Format data for backend
    const submitData = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      username: formData.username?.trim() || formData.email.split('@')[0],
      email: formData.email?.trim().toLowerCase(),
      password: formData.password,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      fitnessGoal: formData.fitnessGoal,
      activityLevel: formData.activityLevel
    };

    console.log('Submitting data:', submitData);
    
    const result = await registerUser(submitData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="First Name *"
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
            />

            <Input
              label="Last Name *"
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
            />
          </div>

          <Input
            label="Username"
            placeholder="Optional - will use email if empty"
            error={errors.username?.message}
            {...register('username', {
              minLength: { value: 3, message: 'Username must be at least 3 characters' }
            })}
          />

          <Input
            label="Email address *"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />

          <div className="relative">
            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password *"
              type={showConfirmPassword ? 'text' : 'password'}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Height (cm) *"
              type="number"
              min="100"
              max="250"
              error={errors.height?.message}
              {...register('height', {
                required: 'Height is required',
                min: { value: 100, message: 'Height must be at least 100cm' },
                max: { value: 250, message: 'Height must be less than 250cm' },
                valueAsNumber: true
              })}
            />

            <Input
              label="Weight (kg) *"
              type="number"
              step="0.1"
              min="30"
              max="300"
              error={errors.weight?.message}
              {...register('weight', {
                required: 'Weight is required',
                min: { value: 30, message: 'Weight must be at least 30kg' },
                max: { value: 300, message: 'Weight must be less than 300kg' },
                valueAsNumber: true
              })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
              )}
            </div>

            <Input
              label="Date of Birth *"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth', {
                required: 'Date of birth is required'
              })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal *
              </label>
              <select
                {...register('fitnessGoal', { required: 'Fitness goal is required' })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
              {errors.fitnessGoal && (
                <p className="text-sm text-red-600 mt-1">{errors.fitnessGoal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level *
              </label>
              <select
                {...register('activityLevel', { required: 'Activity level is required' })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
              {errors.activityLevel && (
                <p className="text-sm text-red-600 mt-1">{errors.activityLevel.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;