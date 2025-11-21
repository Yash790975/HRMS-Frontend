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




































































//working


// import React, { useState, useEffect } from 'react';
// import { X, CheckCircle, AlertCircle } from 'lucide-react';

// const EmployeeActivationModal = ({ isOpen, onClose, employee, onActivate }) => {
//   const [makeActive, setMakeActive] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Reset state when modal opens/closes
//   useEffect(() => {
//     if (isOpen) {
//       setMakeActive(false);
//       setError(null);
//       setSuccess(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const isProbation = employee?.employment_details?.is_probation;
//   const isConfirmed = employee?.employment_details?.is_confirmed_employee;
//   const isActive = employee?.is_active;

//   const handleActivate = async () => {
//     if (!makeActive) {
//       setError('Please check "Make Employee Active" to proceed');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       await onActivate(employee.employee_id);
//       setSuccess(true);
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (err) {
//       setError(err.message || 'Failed to activate employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Employee Activation
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-4">
//           {/* Employee Info */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">
//               Employee Details
//             </h4>
//             <div className="space-y-1 text-sm">
//               <p>
//                 <span className="text-gray-600">Name:</span>{' '}
//                 <span className="font-medium">
//                   {employee?.first_name} {employee?.middle_name || ''}{' '}
//                   {employee?.last_name || ''}
//                 </span>
//               </p>
//               <p>
//                 <span className="text-gray-600">Code:</span>{' '}
//                 <span className="font-medium">{employee?.employee_code}</span>
//               </p>
//               <p>
//                 <span className="text-gray-600">Department:</span>{' '}
//                 <span className="font-medium">
//                   {employee?.employment_details?.department?.name || 'N/A'}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Current Status */}
//           <div className="bg-blue-50 rounded-lg p-4 space-y-2">
//             <h4 className="text-sm font-medium text-blue-900 mb-3">
//               Current Status
//             </h4>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <span className="text-blue-700">On Probation:</span>
//                 <span className={`ml-2 font-semibold ${isProbation ? 'text-orange-600' : 'text-green-600'}`}>
//                   {isProbation ? 'Yes' : 'No'}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-blue-700">Confirmed:</span>
//                 <span className={`ml-2 font-semibold ${isConfirmed ? 'text-green-600' : 'text-gray-600'}`}>
//                   {isConfirmed ? 'Yes' : 'No'}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-blue-700">Active Status:</span>
//                 <span className={`ml-2 font-semibold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
//                   {isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-blue-700">Employment Status:</span>
//                 <span className="ml-2 font-semibold text-gray-800">
//                   {employee?.employment_details?.status_history?.[
//                     employee.employment_details.status_history.length - 1
//                   ]?.status || 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Activation Checkbox */}
//           <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
//             <label className="flex items-center space-x-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={makeActive}
//                 onChange={(e) => setMakeActive(e.target.checked)}
//                 className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-green-900">
//                 Make Employee Active
//               </span>
//             </label>
//             <p className="mt-2 text-xs text-green-700 ml-8">
//               This will confirm the employee, end probation period, and update status to Active
//             </p>
//           </div>

//           {/* What will happen */}
//           {makeActive && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <h5 className="text-xs font-semibold text-yellow-900 mb-2 flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 Changes that will be made:
//               </h5>
//               <ul className="text-xs text-yellow-800 space-y-1 ml-5 list-disc">
//                 {isProbation && (
//                   <>
//                     <li>Probation status will be set to: <strong>False</strong></li>
//                     <li>Confirmed employee will be set to: <strong>True</strong></li>
//                     <li>Confirmation date will be set to: <strong>Today</strong></li>
//                     <li>Probation status will be marked as: <strong>Confirmed</strong></li>
//                   </>
//                 )}
//                 <li>Employee active status will be set to: <strong>True</strong></li>
//                 <li>Employment status will change to: <strong>Active</strong></li>
//               </ul>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-green-800">
//                 Employee activated successfully!
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleActivate}
//             disabled={!makeActive || loading}
//             className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
//               makeActive && !loading
//                 ? 'bg-green-600 hover:bg-green-700'
//                 : 'bg-gray-400 cursor-not-allowed'
//             }`}
//           >
//             {loading ? 'Activating...' : 'Activate Employee'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeActivationModal;
















































// // ConfirmationModal.jsx - Create this as a separate component file
// import React, { useState } from 'react';
// import { X, UserCheck } from 'lucide-react';

// const ConfirmationModal = ({ employee, onClose, onConfirm }) => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!employee) return null;

//   const employmentDetails = employee.employment_details || {};
//   const isProbation = employmentDetails.is_probation;
//   const isConfirmed = employmentDetails.is_confirmed_employee;

//   const handleConfirm = async () => {
//     if (!isChecked) {
//       alert('Please check the "Make Employee Active" checkbox to proceed');
//       return;
//     }

//     setLoading(true);
//     try {
//       await onConfirm(employee.employee_id);
//       alert('Employee status updated successfully!');
//       onClose();
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Failed to update employee status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//           <h3 className="text-xl font-semibold text-gray-900">
//             Employee Confirmation
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-4 space-y-6">
//           {/* Employee Info */}
//           <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//             <h4 className="font-semibold text-gray-900 mb-3">Employee Details</h4>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <span className="text-gray-600">Name:</span>
//                 <p className="font-medium text-gray-900">
//                   {`${employee.first_name} ${employee.middle_name || ''} ${employee.last_name || ''}`}
//                 </p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Employee Code:</span>
//                 <p className="font-medium text-gray-900">{employee.employee_code}</p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Department:</span>
//                 <p className="font-medium text-gray-900">
//                   {employmentDetails.department?.name || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Designation:</span>
//                 <p className="font-medium text-gray-900">
//                   {employmentDetails.designation?.name || 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Current Probation Status */}
//           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//             <h4 className="font-semibold text-gray-900 mb-3">Current Probation Status</h4>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Probation Status:</span>
//                 <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                   isProbation 
//                     ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
//                     : 'bg-green-100 text-green-700 border border-green-300'
//                 }`}>
//                   {isProbation ? 'On Probation' : 'Confirmed'}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">is_probation:</span>
//                 <span className={`font-medium ${isProbation ? 'text-yellow-600' : 'text-green-600'}`}>
//                   {isProbation ? 'true' : 'false'}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">is_confirmed_employee:</span>
//                 <span className={`font-medium ${isConfirmed ? 'text-green-600' : 'text-gray-600'}`}>
//                   {isConfirmed ? 'true' : 'false'}
//                 </span>
//               </div>

//               {employmentDetails.probation_start_date && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Probation Start Date:</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date(employmentDetails.probation_start_date).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}

//               {employmentDetails.probation_end_date && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Probation End Date:</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date(employmentDetails.probation_end_date).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}

//               {employmentDetails.confirmation_date && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">confirmation_date:</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date(employmentDetails.confirmation_date).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">probation_confirmation_status:</span>
//                 <span className="font-medium text-gray-900">
//                   {employmentDetails.probation_confirmation_status || 'N/A'}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Current Employment Status:</span>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   employmentDetails.status_history?.[employmentDetails.status_history.length - 1]?.status === 'Active'
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-blue-100 text-blue-700'
//                 }`}>
//                   {employmentDetails.status_history?.[employmentDetails.status_history.length - 1]?.status || 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action Section */}
//           {isProbation && (
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
//               <h4 className="font-semibold text-gray-900 mb-4">Confirm Employee</h4>
              
//               <div className="space-y-4">
//                 <label className="flex items-start space-x-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={isChecked}
//                     onChange={(e) => setIsChecked(e.target.checked)}
//                     className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
//                   />
//                   <div className="flex-1">
//                     <span className="font-medium text-gray-900 group-hover:text-green-700">
//                       Make Employee Active
//                     </span>
//                     <p className="text-sm text-gray-600 mt-1">
//                       By checking this box, you confirm that:
//                     </p>
//                     <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
//                       <li>The employee's probation period will be ended</li>
//                       <li>Employee status will change from "On_Progress" to "Active"</li>
//                       <li>Confirmation date will be set to today</li>
//                       <li>Employee will be marked as confirmed</li>
//                     </ul>
//                   </div>
//                 </label>

//                 {/* What will change */}
//                 {isChecked && (
//                   <div className="bg-white rounded-lg p-4 border border-green-300">
//                     <h5 className="font-medium text-gray-900 mb-2">Changes to be applied:</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">is_probation:</span>
//                         <span className="font-medium">
//                           <span className="text-yellow-600">true</span> → <span className="text-green-600">false</span>
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">is_confirmed_employee:</span>
//                         <span className="font-medium">
//                           <span className="text-gray-500">false</span> → <span className="text-green-600">true</span>
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">confirmation_date:</span>
//                         <span className="font-medium text-green-600">
//                           {new Date().toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">probation_confirmation_status:</span>
//                         <span className="font-medium text-green-600">Confirmed</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">Employment Status:</span>
//                         <span className="font-medium">
//                           <span className="text-blue-600">On_Progress</span> → <span className="text-green-600">Active</span>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {!isProbation && (
//             <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//               <div className="flex items-center space-x-3">
//                 <UserCheck className="w-6 h-6 text-green-600" />
//                 <div>
//                   <h4 className="font-semibold text-green-900">Employee Already Confirmed</h4>
//                   <p className="text-sm text-green-700 mt-1">
//                     This employee has already completed their probation period and is confirmed.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           {isProbation && (
//             <button
//               onClick={handleConfirm}
//               disabled={!isChecked || loading}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 isChecked && !loading
//                   ? 'bg-green-600 text-white hover:bg-green-700'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               {loading ? 'Updating...' : 'Confirm Employee'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationModal;