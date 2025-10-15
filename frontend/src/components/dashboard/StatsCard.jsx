import React from 'react';
import { clsx } from 'clsx';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const changeColor = change.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="stats-card bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
          <p className={`text-xs font-medium ${changeColor} mt-1 truncate`}>
            {change} from last week
          </p>
        </div>
        <div className={clsx(
          'p-2 sm:p-3 rounded-lg bg-gradient-to-r flex-shrink-0 ml-2',
          colorClasses[color]
        )}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;