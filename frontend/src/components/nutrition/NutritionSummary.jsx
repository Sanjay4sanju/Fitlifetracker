import React, { useMemo } from 'react';
import { Target, Flame, Zap, Apple, Heart, Calendar } from 'lucide-react';

const NutritionSummary = ({ totalCalories, entries, selectedDate }) => {
  const summaryData = useMemo(() => {
    const totals = entries.reduce((acc, entry) => ({
      protein: acc.protein + (parseFloat(entry.protein) || 0),
      carbs: acc.carbs + (parseFloat(entry.carbohydrates) || 0),
      fats: acc.fats + (parseFloat(entry.fats) || 0),
      fiber: acc.fiber + (parseFloat(entry.fiber) || 0),
      sugar: acc.sugar + (parseFloat(entry.sugar) || 0)
    }), { protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 });

    const totalMacros = totals.protein + totals.carbs + totals.fats;
    
    return {
      ...totals,
      proteinPercent: totalMacros > 0 ? (totals.protein / totalMacros) * 100 : 0,
      carbsPercent: totalMacros > 0 ? (totals.carbs / totalMacros) * 100 : 0,
      fatsPercent: totalMacros > 0 ? (totals.fats / totalMacros) * 100 : 0,
      totalCalories: entries.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0)
    };
  }, [entries]);

  const getCalorieGoalProgress = () => {
    const dailyCalorieGoal = 2000; // Default goal, can be customized
    const progress = Math.min(100, (summaryData.totalCalories / dailyCalorieGoal) * 100);
    return {
      progress,
      remaining: Math.max(0, dailyCalorieGoal - summaryData.totalCalories),
      goal: dailyCalorieGoal
    };
  };

  const calorieGoal = getCalorieGoalProgress();

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-green-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target size={20} />
        Nutrition Summary
        {selectedDate && (
          <span className="text-sm font-normal text-gray-600 ml-auto">
            {new Date(selectedDate).toLocaleDateString()}
          </span>
        )}
      </h3>
      
      <div className="space-y-4">
        {/* Calorie Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500" size={18} />
              <span className="text-sm font-medium text-gray-700">Calories</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {Math.round(summaryData.totalCalories)} / {calorieGoal.goal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calorieGoal.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{calorieGoal.goal}</span>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <Zap className="mx-auto text-blue-500 mb-2" size={20} />
            <div className="text-lg font-bold text-blue-900">{Math.round(summaryData.protein)}g</div>
            <div className="text-xs text-blue-600 font-medium">Protein</div>
            <div className="text-xs text-blue-400 mt-1">{summaryData.proteinPercent.toFixed(0)}%</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
            <Apple className="mx-auto text-green-500 mb-2" size={20} />
            <div className="text-lg font-bold text-green-900">{Math.round(summaryData.carbs)}g</div>
            <div className="text-xs text-green-600 font-medium">Carbs</div>
            <div className="text-xs text-green-400 mt-1">{summaryData.carbsPercent.toFixed(0)}%</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
            <Heart className="mx-auto text-purple-500 mb-2" size={20} />
            <div className="text-lg font-bold text-purple-900">{Math.round(summaryData.fats)}g</div>
            <div className="text-xs text-purple-600 font-medium">Fats</div>
            <div className="text-xs text-purple-400 mt-1">{summaryData.fatsPercent.toFixed(0)}%</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{Math.round(summaryData.fiber)}g</div>
            <div className="text-gray-600">Fiber</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{Math.round(summaryData.sugar)}g</div>
            <div className="text-gray-600">Sugar</div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">{entries.length} entries</span>
          <span className="text-sm font-medium text-green-600">
            {calorieGoal.remaining > 0 ? `${calorieGoal.remaining} cal remaining` : 'Goal reached! 🎉'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;