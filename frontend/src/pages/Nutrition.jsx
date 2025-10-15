import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { Plus, Utensils, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { nutritionAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import NutritionEntryForm from '../components/nutrition/NutritionEntryForm';
import NutritionEntryCard from '../components/nutrition/NutritionEntryCard';
import NutritionSummary from '../components/nutrition/NutritionSummary';
import NutritionStats from '../components/nutrition/NutritionStats';

const Nutrition = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    mealType: '',
    search: '',
    viewMode: 'grid' // 'grid' or 'list'
  });

  const queryClient = useQueryClient();

  const { data: nutritionData, isLoading, error } = useQuery({
    queryKey: ['nutrition', selectedDate, filters.mealType],
    queryFn: () => nutritionAPI.getEntries({
      date: selectedDate || undefined,
      mealType: filters.mealType || undefined,
      page: 1,
      limit: 200
    })
  });

  const { data: weeklyComparison } = useQuery({
    queryKey: ['nutrition-weekly-comparison'],
    queryFn: () => nutritionAPI.getWeeklyComparison()
  });

  const addMutation = useMutation({
    mutationFn: nutritionAPI.addEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['nutrition']);
      queryClient.invalidateQueries(['nutrition-weekly-comparison']);
      queryClient.invalidateQueries(['dashboard']);
      setShowAddModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: nutritionAPI.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['nutrition']);
      queryClient.invalidateQueries(['nutrition-weekly-comparison']);
      queryClient.invalidateQueries(['dashboard']);
    }
  });

  // Calculate real weekly stats
  const calculateWeeklyStats = useMemo(() => {
    if (!nutritionData?.entries) return {};

    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const previousWeekStart = subWeeks(currentWeekStart, 1);
    const previousWeekEnd = endOfWeek(previousWeekStart, { weekStartsOn: 1 });

    // Filter entries by week
    const currentWeekEntries = nutritionData.entries.filter(entry => {
      const entryDate = new Date(entry.dateConsumed);
      return entryDate >= currentWeekStart;
    });

    const previousWeekEntries = nutritionData.entries.filter(entry => {
      const entryDate = new Date(entry.dateConsumed);
      return entryDate >= previousWeekStart && entryDate < currentWeekStart;
    });

    // Calculate metrics
    const totalEntriesCurrent = currentWeekEntries.length;
    const totalEntriesPrevious = previousWeekEntries.length;
    const entriesChange = totalEntriesPrevious > 0 
      ? ((totalEntriesCurrent - totalEntriesPrevious) / totalEntriesPrevious * 100).toFixed(0)
      : totalEntriesCurrent > 0 ? 100 : 0;

    const caloriesCurrent = currentWeekEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.calories) || 0), 0);
    const caloriesPrevious = previousWeekEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.calories) || 0), 0);
    const caloriesChange = caloriesPrevious > 0 
      ? ((caloriesCurrent - caloriesPrevious) / caloriesPrevious * 100).toFixed(0)
      : caloriesCurrent > 0 ? 100 : 0;

    const proteinCurrent = currentWeekEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.protein) || 0), 0);
    const proteinPrevious = previousWeekEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.protein) || 0), 0);
    const proteinChange = proteinPrevious > 0 
      ? ((proteinCurrent - proteinPrevious) / proteinPrevious * 100).toFixed(0)
      : proteinCurrent > 0 ? 100 : 0;

    // Calculate weekly goal progress (assuming 21 meals per week goal - 3 per day)
    const weeklyGoal = 21;
    const weeklyGoalProgress = Math.min(100, (totalEntriesCurrent / weeklyGoal) * 100);
    const previousWeekGoalProgress = Math.min(100, (totalEntriesPrevious / weeklyGoal) * 100);
    const goalChange = previousWeekGoalProgress > 0 
      ? ((weeklyGoalProgress - previousWeekGoalProgress) / previousWeekGoalProgress * 100).toFixed(0)
      : weeklyGoalProgress > 0 ? 100 : 0;

    return {
      totalEntries: totalEntriesCurrent,
      entriesChange: `${entriesChange > 0 ? '+' : ''}${entriesChange}%`,
      
      totalCalories: Math.round(caloriesCurrent),
      caloriesChange: `${caloriesChange > 0 ? '+' : ''}${caloriesChange}%`,
      
      totalProtein: Math.round(proteinCurrent),
      proteinChange: `${proteinChange > 0 ? '+' : ''}${proteinChange}%`,
      
      weeklyGoal: Math.round(weeklyGoalProgress),
      goalChange: `${goalChange > 0 ? '+' : ''}${goalChange}%`
    };
  }, [nutritionData]);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let entries = nutritionData?.entries || [];
    
    // Apply search filter
    if (filters.search) {
      entries = entries.filter(entry => 
        entry.foodName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.dateConsumed) - new Date(a.dateConsumed));
    
    return entries;
  }, [nutritionData, filters.search]);

  // Group entries by date for list view
  const entriesByDate = useMemo(() => {
    if (filters.viewMode !== 'list') return {};
    
    return filteredEntries.reduce((groups, entry) => {
      const date = format(new Date(entry.dateConsumed), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});
  }, [filteredEntries, filters.viewMode]);

  const handleAddEntry = async (data) => {
    const entryDate = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();
    await addMutation.mutateAsync({
      ...data,
      dateConsumed: entryDate
    });
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const mealTypes = [
    { value: '', label: 'All Meals', icon: '🍽️' },
    { value: 'breakfast', label: 'Breakfast', icon: '🥞' },
    { value: 'lunch', label: 'Lunch', icon: '🍲' },
    { value: 'dinner', label: 'Dinner', icon: '🍛' },
    { value: 'snack', label: 'Snack', icon: '🍎' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Nutrition page error:', error);
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Utensils size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-red-600 text-lg mb-2">Error loading nutrition data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-green-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Nutrition Tracking</h1>
            <p className="text-gray-600 text-sm sm:text-lg">Monitor your food intake and nutritional balance</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <TrendingUp size={16} />
              <span>Track your macros and calories with precision</span>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 w-full sm:w-auto justify-center"
            size="lg"
          >
            <Plus size={20} />
            <span>Add Food Entry</span>
          </Button>
        </div>
      </div>

      {/* Weekly Stats */}
      <NutritionStats weeklyStats={calculateWeeklyStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={20} />
              Filters & Search
            </h3>
            
            <div className="space-y-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date Filter
                </label>
                <Input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value || null)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">Show entries from specific date</p>
              </div>

              {/* Meal Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <div className="space-y-2">
                  {mealTypes.map(meal => (
                    <button
                      key={meal.value}
                      onClick={() => setFilters(prev => ({ ...prev, mealType: meal.value }))}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        filters.mealType === meal.value
                          ? 'bg-primary-100 border border-primary-300 text-primary-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{meal.icon}</span>
                        <span className="font-medium">{meal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Search size={16} />
                  Search Food
                </label>
                <Input
                  placeholder="Search food entries..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                    className={`flex-1 p-2 rounded-lg transition-all duration-200 ${
                      filters.viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                    className={`flex-1 p-2 rounded-lg transition-all duration-200 ${
                      filters.viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <NutritionSummary 
            totalCalories={nutritionData?.totalCalories || 0}
            entries={filteredEntries}
            selectedDate={selectedDate}
          />
        </div>

        {/* Entries Content */}
        <div className="xl:col-span-3">
          {/* Entries Header */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Food Entries ({filteredEntries.length})
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedDate 
                    ? `Showing entries from ${format(new Date(selectedDate), 'MMMM d, yyyy')}`
                    : 'Showing all entries'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Utensils size={16} />
                <span>{mealTypes.find(m => m.value === filters.mealType)?.label || 'All meals'}</span>
              </div>
            </div>
          </div>

          {/* Entries Grid/List */}
          {filters.viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredEntries.map(entry => (
                <NutritionEntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDeleteEntry(entry.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(entriesByDate).map(([date, dateEntries]) => (
                <div key={date} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {dateEntries.map(entry => (
                      <NutritionEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={() => handleDeleteEntry(entry.id)}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Utensils size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {nutritionData?.entries?.length === 0 ? 'No nutrition entries yet' : 'No entries match your filters'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {nutritionData?.entries?.length === 0 
                  ? 'Start tracking your nutrition journey by adding your first food entry.'
                  : 'Try adjusting your filters or search term to see more entries.'
                }
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Entry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Nutrition Entry"
        size="xl"
      >
        <NutritionEntryForm
          onSubmit={handleAddEntry}
          loading={addMutation.isLoading}
          onCancel={() => setShowAddModal(false)}
          selectedDate={selectedDate}
        />
      </Modal>
    </div>
  );
};

export default Nutrition;