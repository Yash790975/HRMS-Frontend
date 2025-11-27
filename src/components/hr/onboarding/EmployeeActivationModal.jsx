import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, UserCheck, Award } from 'lucide-react';

const EmployeeActivationModal = ({ isOpen, onClose, employee, onActivate, onConfirmProbation }) => {
  const [makeActive, setMakeActive] = useState(false);
  const [confirmProbation, setConfirmProbation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [actionType, setActionType] = useState(null); // 'activate' or 'probation'

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMakeActive(false);
      setConfirmProbation(false);
      setError(null);
      setSuccess(false);
      setActionType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isProbation = employee?.employment_details?.is_probation;
  const isConfirmed = employee?.employment_details?.is_confirmed_employee;
  const isActive = employee?.is_active;

  // Check if employee is already fully activated and confirmed
  const isFullyProcessed = isActive && !isProbation && isConfirmed;

  const handleActivate = async () => {
    if (!makeActive) {
      setError('Please check "Make Employee Active" to proceed');
      return;
    }

    setLoading(true);
    setError(null);
    setActionType('activate');

    try {
      await onActivate(employee.employee_id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to activate employee');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmProbation = async () => {
    if (!confirmProbation) {
      setError('Please check "Confirm Probation" to proceed');
      return;
    }

    setLoading(true);
    setError(null);
    setActionType('probation');

    try {
      await onConfirmProbation(employee.employee_id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to confirm probation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Management
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Employee Details
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">
                  {employee?.first_name} {employee?.middle_name || ''}{' '}
                  {employee?.last_name || ''}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Code:</span>{' '}
                <span className="font-medium">{employee?.employee_code}</span>
              </p>
              <p>
                <span className="text-gray-600">Department:</span>{' '}
                <span className="font-medium">
                  {employee?.employment_details?.department?.name || 'N/A'}
                </span>
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-blue-900 mb-3">
              Current Status
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700">Active Status:</span>
                <span className={`ml-2 font-semibold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Employment Status:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {employee?.employment_details?.status_history?.[
                    employee.employment_details.status_history.length - 1
                  ]?.status || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">On Probation:</span>
                <span className={`ml-2 font-semibold ${isProbation ? 'text-orange-600' : 'text-green-600'}`}>
                  {isProbation ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Confirmed:</span>
                <span className={`ml-2 font-semibold ${isConfirmed ? 'text-green-600' : 'text-gray-600'}`}>
                  {isConfirmed ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* If employee is fully processed */}
          {isFullyProcessed && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-green-900 mb-1">
                  Employee Fully Activated
                </h5>
                <p className="text-xs text-green-700">
                  This employee is already active and has completed their probation period. 
                  No further action is required.
                </p>
              </div>
            </div>
          )}

          {/* Show action options only if not fully processed */}
          {!isFullyProcessed && (
            <>
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Available Actions</span>
                </div>
              </div>

              {/* Action 1: Activate Employee (if not active) */}
              {!isActive && (
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-green-900 mb-2">
                        Activate Employee
                      </h5>
                      <label className="flex items-center space-x-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={makeActive}
                          onChange={(e) => setMakeActive(e.target.checked)}
                          disabled={loading}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-green-900">
                          Make Employee Active
                        </span>
                      </label>
                      <p className="text-xs text-green-700 mb-3">
                        This will set the employee as active and update their employment status to "Active"
                      </p>
                      
                      {makeActive && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <h6 className="text-xs font-semibold text-yellow-900 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Changes that will be made:
                          </h6>
                          <ul className="text-xs text-yellow-800 space-y-1 ml-5 list-disc">
                            <li>Employee active status will be set to: <strong>True</strong></li>
                            <li>Employment status will change to: <strong>Active</strong></li>
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleActivate}
                        disabled={!makeActive || loading}
                        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                          makeActive && !loading
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {loading && actionType === 'activate' ? 'Activating...' : 'Activate Employee'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action 2: Confirm Probation (if on probation) */}
              {isProbation && (
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-purple-900 mb-2">
                        Confirm Probation Period
                      </h5>
                      <label className="flex items-center space-x-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={confirmProbation}
                          onChange={(e) => setConfirmProbation(e.target.checked)}
                          disabled={loading}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-purple-900">
                          Confirm Probation
                        </span>
                      </label>
                      <p className="text-xs text-purple-700 mb-3">
                        This will mark the probation period as completed and confirm the employee
                      </p>
                      
                      {confirmProbation && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <h6 className="text-xs font-semibold text-yellow-900 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Changes that will be made:
                          </h6>
                          <ul className="text-xs text-yellow-800 space-y-1 ml-5 list-disc">
                            <li>Probation status will be set to: <strong>False</strong></li>
                            <li>Confirmed employee will be set to: <strong>True</strong></li>
                            <li>Confirmation date will be set to: <strong>Today</strong></li>
                            <li>Probation status will be marked as: <strong>Confirmed</strong></li>
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleConfirmProbation}
                        disabled={!confirmProbation || loading}
                        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                          confirmProbation && !loading
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {loading && actionType === 'probation' ? 'Confirming...' : 'Confirm Probation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                {actionType === 'activate' 
                  ? 'Employee activated successfully!' 
                  : 'Probation confirmed successfully!'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeActivationModal;
