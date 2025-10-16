import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Input
        label="Email address"
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
          label="Password"
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
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;