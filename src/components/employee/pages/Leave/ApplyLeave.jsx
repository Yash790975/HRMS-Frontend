import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Save } from 'lucide-react';
import { useLeave } from '../../contexts/LeaveContext';
import { useNotification } from '../../contexts/NotificationContext';

const ApplyLeave = () => {
  const { applyLeave, leaveBalance } = useLeave();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false,
    emergencyContact: ''
  });

  const [errors, setErrors] = useState({});

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return formData.halfDay ? 0.5 : diffDays;
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    const days = calculateDays();
    const availableBalance = leaveBalance[formData.type]?.remaining || 0;
    if (days > availableBalance) {
      newErrors.balance = `Insufficient leave balance. Available: ${availableBalance} days`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const leaveData = {
      ...formData,
      days: calculateDays()
    };

    const newLeave = applyLeave(leaveData);
    
    addNotification({
      title: 'Leave Application Submitted',
      message: `Your ${formData.type} leave request has been submitted for approval.`,
      type: 'success'
    });

    navigate('/leave');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/leave')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
              <p className="text-gray-600">Submit a new leave request</p>
            </div>
          </div>
          <Calendar className="h-8 w-8 text-orange-600" />
        </div>

        {/* Leave Balance Summary */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-orange-900 mb-2">Available Leave Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <div key={type} className="text-center">
                <p className="text-sm text-orange-700 capitalize">{type}</p>
                <p className="font-bold text-orange-900">{balance.remaining} days</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Half Day Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="halfDay"
              checked={formData.halfDay}
              onChange={(e) => handleInputChange('halfDay', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="halfDay" className="ml-2 text-sm text-gray-700">
              Half Day Leave
            </label>
          </div>

          {/* Calculated Days */}
          {formData.startDate && formData.endDate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Total Days:</span> {calculateDays()} days
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Remaining Balance:</span> {leaveBalance[formData.type]?.remaining || 0} days
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={4}
              placeholder="Please provide a reason for your leave request..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.reason ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.reason && (
              <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact (Optional)
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Contact person during your absence"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Balance Error */}
          {errors.balance && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.balance}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/leave')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;