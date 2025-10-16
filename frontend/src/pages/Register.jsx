import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Eye, EyeOff, User, Mail, Lock, Ruler, Scale, Calendar, Target, Activity, Heart } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Modern Card Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Desktop Header - Top Branding */}
            <div className="hidden lg:block text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <BarChart3 size={28} className="text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-gray-900">FitLife Tracker</h1>
                  <p className="text-gray-600 mt-1">Start your fitness journey today</p>
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto"></div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Join our fitness community</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <User size={16} className="mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    error={errors.firstName?.message}
                    icon={<User size={18} />}
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' }
                    })}
                  />

                  <Input
                    label="Last Name *"
                    error={errors.lastName?.message}
                    icon={<User size={18} />}
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    placeholder="Optional"
                    error={errors.username?.message}
                    icon={<User size={18} />}
                    {...register('username', {
                      minLength: { value: 3, message: 'Username must be at least 3 characters' }
                    })}
                  />

                  <Input
                    label="Email address *"
                    type="email"
                    error={errors.email?.message}
                    icon={<Mail size={18} />}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Lock size={16} className="mr-2" />
                  Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      error={errors.password?.message}
                      icon={<Lock size={18} />}
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
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
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
                      icon={<Lock size={18} />}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Activity size={16} className="mr-2" />
                  Physical Stats
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Height (cm) *"
                    type="number"
                    min="100"
                    max="250"
                    error={errors.height?.message}
                    icon={<Ruler size={18} />}
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
                    icon={<Scale size={18} />}
                    {...register('weight', {
                      required: 'Weight is required',
                      min: { value: 30, message: 'Weight must be at least 30kg' },
                      max: { value: 300, message: 'Weight must be less than 300kg' },
                      valueAsNumber: true
                    })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User size={16} className="mr-2" />
                      Gender *
                    </label>
                    <select
                      {...register('gender', { required: 'Gender is required' })}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
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
                    icon={<Calendar size={18} />}
                    {...register('dateOfBirth', {
                      required: 'Date of birth is required'
                    })}
                  />
                </div>
              </div>

              {/* Fitness Goals */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Target size={16} className="mr-2" />
                  Fitness Goals
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Target size={16} className="mr-2" />
                      Fitness Goal *
                    </label>
                    <select
                      {...register('fitnessGoal', { required: 'Fitness goal is required' })}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Activity size={16} className="mr-2" />
                      Activity Level *
                    </label>
                    <select
                      {...register('activityLevel', { required: 'Activity level is required' })}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
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
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25"
                size="large"
              >
                {loading ? (
                  'Creating Account...'
                ) : (
                  <span className="flex items-center justify-center">
                    <Heart size={18} className="mr-2" />
                    Start Your Journey
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </form>

            {/* Features Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
                  Why Join FitLife Tracker?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                    <Target size={14} className="mr-2 text-primary-500" />
                    Track Goals
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                    <Activity size={14} className="mr-2 text-primary-500" />
                    Monitor Progress
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                    <BarChart3 size={14} className="mr-2 text-primary-500" />
                    Get Insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;