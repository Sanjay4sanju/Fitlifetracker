import React from 'react';
import { format } from 'date-fns';
import { Trash2, Utensils, Edit, MoreVertical } from 'lucide-react';

const NutritionEntryCard = ({ entry, onDelete, onEdit, compact = false }) => {
  const getMealTypeColor = (mealType) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      lunch: 'bg-green-100 text-green-800 border-green-200',
      dinner: 'bg-blue-100 text-blue-800 border-blue-200',
      snack: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[mealType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMealTypeIcon = (mealType) => {
    const icons = {
      breakfast: '🥞',
      lunch: '🍲',
      dinner: '🍛',
      snack: '🍎'
    };
    return icons[mealType] || '🍽️';
  };

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    };
    return labels[mealType] || mealType;
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getMealTypeIcon(entry.mealType)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMealTypeColor(entry.mealType)}`}>
              {getMealTypeLabel(entry.mealType)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(entry.dateConsumed), 'HH:mm')}
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-2 truncate">{entry.foodName}</h4>
        
        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <div className="text-sm font-bold text-gray-900">{entry.calories}</div>
            <div className="text-xs text-gray-500">cal</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600">{entry.protein}g</div>
            <div className="text-xs text-gray-500">prot</div>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-600">{entry.carbohydrates}g</div>
            <div className="text-xs text-gray-500">carbs</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600">{entry.fats}g</div>
            <div className="text-xs text-gray-500">fats</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getMealTypeColor(entry.mealType)}`}>
            <span className="text-lg">{getMealTypeIcon(entry.mealType)}</span>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMealTypeColor(entry.mealType)}`}>
              {getMealTypeLabel(entry.mealType)}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {format(new Date(entry.dateConsumed), 'MMM d, yyyy • HH:mm')}
            </div>
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors duration-200"
            title="Delete entry"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-3">{entry.foodName}</h3>
      
      {/* Main Nutrition Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
          <div className="text-xl font-bold text-orange-600">{entry.calories}</div>
          <div className="text-xs text-orange-800 font-medium">Calories</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="text-xl font-bold text-green-600">{entry.protein}g</div>
          <div className="text-xs text-green-800 font-medium">Protein</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{entry.carbohydrates}g</div>
          <div className="text-xs text-blue-800 font-medium">Carbs</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{entry.fats}g</div>
          <div className="text-xs text-purple-800 font-medium">Fats</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
        {entry.portionSize && (
          <span>Portion: {entry.portionSize} {entry.portionUnit}</span>
        )}
        {entry.fiber > 0 && (
          <span>Fiber: {entry.fiber}g</span>
        )}
        {entry.sugar > 0 && (
          <span>Sugar: {entry.sugar}g</span>
        )}
      </div>

      {entry.notes && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700">{entry.notes}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Added {format(new Date(entry.createdAt), 'MMM d, yyyy')}
        </span>
        <button
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NutritionEntryCard;