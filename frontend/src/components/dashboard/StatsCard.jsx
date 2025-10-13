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
    <div className="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-xs font-medium ${changeColor} mt-1`}>
            {change} from last week
          </p>
        </div>
        <div className={clsx(
          'p-3 rounded-lg bg-gradient-to-r',
          colorClasses[color]
        )}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;