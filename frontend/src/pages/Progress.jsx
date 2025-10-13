import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { Plus, TrendingUp, Scale } from 'lucide-react';
import { progressAPI } from '../services/api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressEntryForm from '../components/progress/ProgressEntryForm';
import ProgressChart from '../components/progress/ProgressChart';
import ProgressStats from '../components/progress/ProgressStats';

const Progress = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeRange, setTimeRange] = useState('365'); // Default to 1 year to see all data

  const queryClient = useQueryClient();

  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ['progress', timeRange],
    queryFn: () => progressAPI.getEntries({
      startDate: subDays(new Date(), parseInt(timeRange)).toISOString(),
      endDate: new Date().toISOString()
    })
  });

  const addMutation = useMutation({
    mutationFn: progressAPI.addEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['progress']);
      queryClient.invalidateQueries(['dashboard']);
      setShowAddModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: progressAPI.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['progress']);
      queryClient.invalidateQueries(['dashboard']);
    }
  });

  const handleAddProgress = async (data) => {
    await addMutation.mutateAsync(data);
  };

  const handleDeleteProgress = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    console.error('Progress page error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading progress data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Progress Data:', progressData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your body measurements and fitness progress</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Measurement</span>
        </Button>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="730">Last 2 years</option>
          </select>
        </div>
      </div>

      {/* Charts and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart 
            data={progressData?.entries || []} 
            timeRange={timeRange}
          />
        </div>
        <ProgressStats data={progressData?.entries || []} />
      </div>

      {/* Recent Measurements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Measurements</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {progressData?.entries?.slice(0, 10).map((entry) => (
            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <Scale size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {entry.weight} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.progressDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {entry.bodyFatPercentage && (
                  <p className="text-sm text-gray-600">
                    Body Fat: {entry.bodyFatPercentage}%
                  </p>
                )}
                {entry.mood && (
                  <p className="text-sm text-gray-500 capitalize">
                    Mood: {entry.mood.replace('_', ' ')}
                  </p>
                )}
                <button 
                  onClick={() => handleDeleteProgress(entry.id)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {(!progressData?.entries || progressData.entries.length === 0) && (
            <div className="text-center py-12">
              <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No progress entries</h3>
              <p className="text-gray-500">Start tracking your progress by adding your first measurement.</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                Add First Measurement
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Progress Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Progress Measurement"
        size="md"
      >
        <ProgressEntryForm
          onSubmit={handleAddProgress}
          loading={addMutation.isLoading}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Progress;