import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPreviewUrl(user.profilePicture || '');
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'confirmPassword' && value !== passwordData.newPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      console.log('Attempting to change password...');
      const response = await axios.put('/api/users/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Password change response:', response.data);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error.response?.data || error);
      setPasswordError(error.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      // Send profile data as JSON
      const response = await axios.put('/api/users/profile', {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio
      });

      // If there's a new profile image, send it separately
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        const imageResponse = await axios.put('/api/users/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Update the preview URL with the new image path
        setPreviewUrl(imageResponse.data.profilePicture);
      }

      // If username was changed and we got a new token
      if (response.data.token) {
        // Update the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Update axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      // Update the user state with the new data
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
              <i className="fas fa-user-cog text-2xl text-white"></i>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Profile Settings</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Manage your account information and customize your fitness journey
            </p>
          </div>

          {/* Success/Error Message */}
          {message.text && (
              <div className="mb-8">
                <div
                    className={`rounded-2xl p-6 border ${
                        message.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-red-50 border-red-200 text-red-700"
                    }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i
                          className={`fas ${
                              message.type === "success"
                                  ? "fa-check-circle text-emerald-500"
                                  : "fa-exclamation-circle text-red-500"
                          } text-xl`}
                      ></i>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">{message.text}</p>
                    </div>
                  </div>
                </div>
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Profile Picture</h2>

                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <img
                        className="h-32 w-32 object-cover rounded-full shadow-lg border-4 border-white"
                        src={previewUrl ? `http://localhost:8080/api/uploads/${previewUrl}`: '/images/default-avatar.png'}
                        alt="Profile"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/images/default-avatar.png?height=128&width=128"
                        }}
                    />
                    <div
                        className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <i className="fas fa-camera text-white"></i>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-slate-500">Upload a new profile picture. JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-user text-blue-600"></i>
                  </div>
                  Basic Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-user text-slate-400"></i>
                        </div>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-user text-slate-400"></i>
                        </div>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-slate-400"></i>
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Username</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-at text-slate-400"></i>
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-lock text-red-600"></i>
                  </div>
                  Change Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-slate-400"></i>
                        </div>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                            className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                            required
                            minLength={6}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-key text-slate-400"></i>
                          </div>
                          <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter new password"
                              className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                              required
                              minLength={6}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-key text-slate-400"></i>
                          </div>
                          <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm new password"
                              className="block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                              required
                              minLength={6}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {passwordError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <i className="fas fa-exclamation-circle text-red-500"></i>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-700">{passwordError}</p>
                          </div>
                        </div>
                      </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <i className="fas fa-info-circle text-yellow-600"></i>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-yellow-800">Password Requirements</h3>
                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                          <li>At least 6 characters long</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i className="fas fa-shield-alt mr-2"></i>
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-book text-emerald-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">12</div>
                  <div className="text-sm text-slate-500 font-medium">Recipes Created</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-heart text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">48</div>
                  <div className="text-sm text-slate-500 font-medium">Favorites</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">156</div>
                  <div className="text-sm text-slate-500 font-medium">Followers</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar text-orange-600"></i>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-900">6</div>
                  <div className="text-sm text-slate-500 font-medium">Months Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile; 