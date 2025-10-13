import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI, notificationAPI } from '../services/api';
import { 
  User, 
  Shield, 
  Save,
  Download,
  Trash2,
  Key,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || 'male',
    fitnessGoal: user?.fitnessGoal || 'maintenance',
    activityLevel: user?.activityLevel || 'moderate'
  });

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    }
  });

  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: (data) => userAPI.changePassword(data),
    onSuccess: () => {
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  });

  // Mutation for exporting data
  const exportDataMutation = useMutation({
    mutationFn: () => userAPI.exportData()
  });

  // Mutation for deleting account - UPDATED
  const deleteAccountMutation = useMutation({
    mutationFn: () => userAPI.deleteAccount({ confirmation: 'DELETE MY ACCOUNT' }),
    onSuccess: () => {
      // Clear all local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Delete account error:', error);
      alert(error.response?.data?.message || 'Error deleting account');
    }
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync(profileData);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    await changePasswordMutation.mutateAsync({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleExportData = async () => {
    try {
      const response = await exportDataMutation.mutateAsync();
      
      // Create blob from response data
      const blob = new Blob([JSON.stringify(response, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `fitlifetracker-data-${user?.id || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }
    
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all data!')) {
      try {
        await deleteAccountMutation.mutateAsync();
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const fitnessGoals = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'endurance', label: 'Endurance' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'active', label: 'Active' },
    { value: 'very_active', label: 'Very Active' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border-r-2 border-primary-500'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={24} />
                  Profile Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Update your personal information and fitness goals</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                    min="100"
                    max="250"
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                    min="30"
                    max="300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fitness Goal</label>
                    <select
                      value={profileData.fitnessGoal}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {fitnessGoals.map(goal => (
                        <option key={goal.value} value={goal.value}>
                          {goal.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
                    <select
                      value={profileData.activityLevel}
                      onChange={(e) => setProfileData(prev => ({ ...prev, activityLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    loading={updateProfileMutation.isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key size={24} />
                    Password & Security
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your password and security settings</p>
                </div>

                <div className="p-6">
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Key size={20} />
                    <span>Change Password</span>
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Download size={24} />
                    Data Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Export your data or manage your account</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Export Your Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Download all your fitness data in JSON format</p>
                    </div>
                    <Button
                      onClick={handleExportData}
                      loading={exportDataMutation.isLoading}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Export</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <h3 className="font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowDeleteModal(true)}
                      variant="danger"
                      className="flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            required
            minLength={6}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={changePasswordMutation.isLoading}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
              <AlertTriangle size={20} />
              <span className="font-semibold">Warning: This action cannot be undone</span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm">
              This will permanently delete your account, workouts, nutrition data, and all associated information. 
              You will lose access to your fitness history and progress tracking.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To confirm, type <span className="font-mono font-bold">DELETE MY ACCOUNT</span> below:
            </label>
            <Input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteAccountMutation.isLoading}
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE MY ACCOUNT'}
            >
              Delete Account Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;