import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Modern Card Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome Back
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Sign in to continue your fitness journey
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
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

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Show password
                  </label>
                </div>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors"
                >
                  
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25"
                size="large"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight size={18} className="ml-2" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </form>

            {/* Additional Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
                  Start Your Fitness Journey
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="bg-gray-50 rounded-lg p-2">Track Progress</div>
                  <div className="bg-gray-50 rounded-lg p-2">Set Goals</div>
                  <div className="bg-gray-50 rounded-lg p-2">Get Insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;