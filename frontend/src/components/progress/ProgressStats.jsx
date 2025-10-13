import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ProgressStats = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Stats</h3>
        <p className="text-gray-500 text-center py-8">
          Add more measurements to see progress statistics
        </p>
      </div>
    );
  }

  const current = data[0];
  const previous = data[1];

  const weightChange = current.weight - previous.weight;
  const weightChangePercent = ((weightChange / previous.weight) * 100).toFixed(1);

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp size={16} className="text-red-500" />;
    if (change < 0) return <TrendingDown size={16} className="text-green-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Stats</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Weight Change</span>
          <div className="flex items-center space-x-2">
            {getTrendIcon(weightChange)}
            <span className={`text-sm font-medium ${getTrendColor(weightChange)}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg ({weightChangePercent}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-900">{current.weight} kg</div>
            <div className="text-xs text-blue-600">Current Weight</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{previous.weight} kg</div>
            <div className="text-xs text-gray-600">Previous</div>
          </div>
        </div>

        {current.bodyFatPercentage && previous.bodyFatPercentage && (
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Body Fat Change</span>
            <div className="flex items-center space-x-2">
              {getTrendIcon(current.bodyFatPercentage - previous.bodyFatPercentage)}
              <span className={`text-sm font-medium ${getTrendColor(current.bodyFatPercentage - previous.bodyFatPercentage)}`}>
                {(current.bodyFatPercentage - previous.bodyFatPercentage).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Based on {data.length} measurements
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;