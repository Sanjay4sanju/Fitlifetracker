import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  loading = false,
  compact = false,
  onClick 
}) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      light: 'bg-green-50 text-green-700',
      border: 'border-green-200'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50 text-purple-700',
      border: 'border-purple-200'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      light: 'bg-orange-50 text-orange-700',
      border: 'border-orange-200'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      light: 'bg-red-50 text-red-700',
      border: 'border-red-200'
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50 text-indigo-700',
      border: 'border-indigo-200'
    }
  };

  const isPositive = change?.startsWith('+');
  const changeValue = change?.replace(/[+-]/g, '') || '0';
  const currentColor = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return (
      <div className={clsx(
        "bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 h-full animate-pulse",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      )}>
        <div className="flex items-center justify-between h-full">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl ml-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={clsx(
        "bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 h-full group",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between h-full">
        {/* Content */}
        <div className="flex-1 min-w-0 mr-3">
          {/* Title */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate mb-1">
            {title}
          </p>
          
          {/* Value - Responsive sizing */}
          <p className={clsx(
            "font-bold text-gray-900 mb-2 truncate",
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-4xl"
          )}>
            {value}
          </p>

          {/* Change Indicator */}
          {change && (
            <div className={clsx(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
              isPositive 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            )}>
              {isPositive ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              <span className="font-semibold">
                {changeValue}
              </span>
              <span className="ml-1 text-gray-600">from last week</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={clsx(
          "p-2 sm:p-3 rounded-xl bg-gradient-to-r flex-shrink-0 transition-all duration-300 group-hover:scale-110",
          currentColor.gradient,
          compact ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"
        )}>
          <Icon 
            size={compact ? 20 : 24} 
            className="text-white" 
          />
        </div>
      </div>

      {/* Progress Bar for positive/negative indication */}
      {change && (
        <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={clsx(
              "h-1 rounded-full transition-all duration-500",
              isPositive ? "bg-green-500" : "bg-red-500"
            )}
            style={{ 
              width: isPositive ? '75%' : '25%' 
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

// Additional component for grid layout optimization
export const StatsGrid = ({ children, columns = 1 }) => {
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={clsx(
      "grid gap-3 sm:gap-4 lg:gap-6",
      gridColumns[columns]
    )}>
      {children}
    </div>
  );
};

export default StatsCard;