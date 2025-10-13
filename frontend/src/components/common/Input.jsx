// frontend/src/components/common/Input.jsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '',
  id,
  name,
  ...props 
}, ref) => {
  // if no id provided, fallback to name so label still works
  const inputId = id || name;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={clsx(
            'text-xs mt-1',
            error ? 'text-red-600' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
