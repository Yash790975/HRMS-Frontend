import React, { useState } from 'react';
import { User, Mail, Phone, Building, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/helpers';

const ITProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: 'it@company.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    department: 'Information Technology',
    employeeId: 'IT001',
    joiningDate: '2021-03-15',
    reportingManager: 'IT Manager',
    workLocation: 'Mumbai Office',
    bio: 'Experienced IT professional with 4+ years in system administration and technical support.',
    specializations: 'Network Administration, System Security, Hardware Troubleshooting',
    certifications: 'CompTIA A+, Network+, Security+'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend/localStorage
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      fullName: user?.fullName || '',
      email: 'it@company.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      department: 'Information Technology',
      employeeId: 'IT001',
      joiningDate: '2021-03-15',
      reportingManager: 'IT Manager',
      workLocation: 'Mumbai Office',
      bio: 'Experienced IT professional with 4+ years in system administration and technical support.',
      specializations: 'Network Administration, System Security, Hardware Troubleshooting',
      certifications: 'CompTIA A+, Network+, Security+'
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
              <p className="text-orange-100">{user?.designation}</p>
              <p className="text-orange-200 text-sm">IT Management System</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <p className="text-gray-900">{profileData.employeeId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900">{profileData.department}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <p className="text-gray-900">{user?.designation}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <p className="text-gray-900">{profileData.joiningDate}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
              {isEditing ? (
                <input
                  type="text"
                  name="reportingManager"
                  value={profileData.reportingManager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.reportingManager}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="workLocation"
                  value={profileData.workLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.workLocation}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bio Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bio</h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700">{profileData.bio}</p>
          )}
        </div>

        {/* Technical Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Specializations</h2>
          {isEditing ? (
            <textarea
              name="specializations"
              value={profileData.specializations}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="List your technical specializations..."
            />
          ) : (
            <p className="text-gray-700">{profileData.specializations}</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
        {isEditing ? (
          <input
            type="text"
            name="certifications"
            value={profileData.certifications}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="List your certifications..."
          />
        ) : (
          <p className="text-gray-700">{profileData.certifications}</p>
        )}
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium text-gray-900">
                {user?.loginTime ? formatDateTime(user.loginTime) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITProfile;