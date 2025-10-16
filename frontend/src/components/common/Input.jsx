import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '',
  size = 'medium',
  icon,
  ...props 
}, ref) => {
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-4 py-4 text-lg'
  };

  const baseClasses = 'w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 shadow-sm';
  
  const classes = clsx(
    baseClasses,
    sizes[size],
    error && 'border-red-500 focus:ring-red-500',
    icon && 'pl-10',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={classes}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;