import React, { useState, useEffect } from 'react';
import { Users, Plus, UserCheck, Clock } from 'lucide-react';
import EmployeeTable from './onboarding/EmployeeTable';
import EmployeeDetailsView from './onboarding/EmployeeDetailsView';
import EmployeeModal from './onboarding/EmployeeModal';
import { EmployeeMasterAPI } from '../../api/employeeMaster';
import { EmployeeStatusHistoryAPI } from '../../api/employeeStatusHistory';
import EmployeeManagementTable from './onboarding/EmployeeManagementTable';

const EmployeesManagement = () => { 
  const [employees, setEmployees] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('table');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null });

  // ✅ Fetch employees and status history from API
  useEffect(() => {
    loadEmployeesAndStatus();
  }, []);

  const loadEmployeesAndStatus = async () => {
    try {
      setLoading(true);
      
      // Fetch both employees and status history
      const [employeesResponse, statusHistoryResponse] = await Promise.all([
        EmployeeMasterAPI.getAll(),
        EmployeeStatusHistoryAPI.getAll()
      ]);

      if (employeesResponse?.success && Array.isArray(employeesResponse.result)) {
        setEmployees(employeesResponse.result);
      } else {
        console.error('Unexpected API response for employees:', employeesResponse);
      }

      if (statusHistoryResponse?.success && Array.isArray(statusHistoryResponse.result)) {
        setStatusHistory(statusHistoryResponse.result);
      } else {
        console.error('Unexpected API response for status history:', statusHistoryResponse);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get active employee IDs from status history
  const getActiveEmployeeIds = () => {
    const activeIds = new Set();
    
    statusHistory.forEach((history) => {
      // Check if status is "Active" only
      if (history.status === 'Active') {
        const employeeId = history.employment_details?.employee_id;
        if (employeeId) {
          activeIds.add(employeeId);
        }
      }
    });
    
    return activeIds;
  };

  // Filter employees to show only active ones
  const getActiveEmployees = () => {
    const activeIds = getActiveEmployeeIds();
    return employees.filter(emp => activeIds.has(emp.employee_id));
  };

  const activeEmployees = getActiveEmployees();

  // ✅ Handle view details - store employee ID and switch view
  const handleViewEmployee = (employeeId) => {
    console.log('=== ONBOARDING - HANDLE VIEW EMPLOYEE ===');
    console.log('Received employeeId:', employeeId);
    console.log('Type:', typeof employeeId);
    setSelectedEmployeeId(employeeId);
    console.log('Set selectedEmployeeId to:', employeeId);
    setCurrentView('details');
    console.log('Changed view to: details');
  };

  const handleEditEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setCurrentView('edit');
  };

  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedEmployeeId(null);
    setSelectedEmployee(null);
    loadEmployeesAndStatus(); // Refresh the list
  };

  const handleDeleteEmployee = async (employeeId) => {
    setConfirmModal({
      show: true,
      onConfirm: async () => {
        try {
          const response = await EmployeeMasterAPI.delete(employeeId);
          console.log(response);

          if (response?.success) {
            setAlertModal({ show: true, message: 'Employee deleted successfully', type: 'success' });
            loadEmployeesAndStatus(); // Refresh the list
          } else {
            setAlertModal({ show: true, message: 'Failed to delete employee', type: 'error' });
          }
        } catch (error) {
          console.error('Error deleting employee:', error);
          setAlertModal({ show: true, message: 'Error deleting employee', type: 'error' });
        }
      }
    });
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const response = await EmployeeMasterAPI.update(updatedEmployee);
      console.log(response);
      if (response?.success) {
        setAlertModal({ show: true, message: 'Employee updated successfully', type: 'success' });
        loadEmployeesAndStatus();
        setCurrentView('table');
        setSelectedEmployee(null);
      } else {
        setAlertModal({ show: true, message: 'Failed to update employee', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setAlertModal({ show: true, message: 'Error updating employee', type: 'error' });
    }
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await EmployeeMasterAPI.add(newEmployee);
      if (response?.success) {
        setAlertModal({ show: true, message: 'Employee added successfully', type: 'success' });
        loadEmployeesAndStatus();
        setShowAddModal(false);
      } else {
        setAlertModal({ show: true, message: 'Failed to add employee', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setAlertModal({ show: true, message: 'Error adding employee', type: 'error' });
    }
  };

  const handleAction = (action, data) => {
    console.log('Action:', action, 'Data:', data);
    if (action === 'view') {
      handleViewEmployee(data);
    } else if (action === 'edit') {
      handleEditEmployee(data);
      console.log(data);
    }
  };

  // Alert Modal Component
  const AlertModal = () => {
    if (!alertModal.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className={`text-lg font-semibold mb-3 ${alertModal.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {alertModal.type === 'success' ? '✓ Success' : '✗ Error'}
          </h3>
          <p className="text-gray-700 mb-4">{alertModal.message}</p>
          <button
            onClick={() => setAlertModal({ show: false, message: '', type: 'success' })}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  // Confirm Modal Component
  const ConfirmModal = () => {
    if (!confirmModal.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 text-orange-600">Confirm Delete</h3>
          <p className="text-gray-700 mb-6">Are you sure you want to delete this employee?</p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal({ show: false, onConfirm: null });
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmModal({ show: false, onConfirm: null })}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'details') {
    console.log('=== RENDERING DETAILS VIEW ===');
    console.log('Passing employeeId:', selectedEmployeeId);
    return (
      <EmployeeDetailsView
        employeeId={selectedEmployeeId}
        onBack={handleBackToTable} 
      />
    );
  }

  if (currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployeeModal
          type="edit"
          employeeId={selectedEmployeeId}
          isOpen={true}
          onClose={handleBackToTable}
          onSave={handleUpdateEmployee}
          hideSearch={true}
        />
      </div>
    );
  }

  // ✅ Calculate stats - using only active employees
  const probationaryCount = activeEmployees.filter(
    emp => emp.employment_details?.is_probation
  ).length;

  const permanentCount = activeEmployees.filter(
    emp => !emp.employment_details?.is_probation
  ).length;

  const thisMonthJoiners = activeEmployees.filter(emp => {
    const joiningDate = new Date(emp.employment_details?.date_of_joining);
    const now = new Date(); 
    return joiningDate.getMonth() === now.getMonth() && 
           joiningDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-gray-600 mt-1">Manage new employee onboarding and probation</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats - Now showing only active employees */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
              <p className="text-gray-600 text-sm">Active Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{probationaryCount}</p>
              <p className="text-gray-600 text-sm">On Probation</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{permanentCount}</p>
              <p className="text-gray-600 text-sm">Permanent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{thisMonthJoiners}</p>
              <p className="text-gray-600 text-sm">Joined This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table Component - Passing only active employees */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : (
        <EmployeeManagementTable
          employees={activeEmployees}
          onViewDetails={handleViewEmployee}
          onAction={handleAction}
          onDelete={handleDeleteEmployee}
        />
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <EmployeeModal
          type="add"
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}

      {/* Alert and Confirm Modals */}
      <AlertModal />
      <ConfirmModal />
    </div>
  );
};

export default EmployeesManagement;


































// import React, { useState, useEffect } from 'react';
// import { Users, Plus, UserCheck, Clock } from 'lucide-react';
// import EmployeeTable from './onboarding/EmployeeTable';
// import EmployeeDetailsView from './onboarding/EmployeeDetailsView';
// import EmployeeModal from './onboarding/EmployeeModal';
// import { EmployeeMasterAPI } from '../../api/employeeMaster';
// import { EmployeeStatusHistoryAPI } from '../../api/employeeStatusHistory';
// // import {EmployeeStatusHistory } from '../../api/employeeStatusHistory';
// import EmployeeManagementTable from './onboarding/EmployeeManagementTable';

// const EmployeesManagement = () => { 
//   const [employees, setEmployees] = useState([]);
//   const [statusHistory, setStatusHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentView, setCurrentView] = useState('table');
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);

//   // ✅ Fetch employees and status history from API
//   useEffect(() => {
//     loadEmployeesAndStatus();
//   }, []);

//   const loadEmployeesAndStatus = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch both employees and status history
//       const [employeesResponse, statusHistoryResponse] = await Promise.all([
//         EmployeeMasterAPI.getAll(),
//         EmployeeStatusHistoryAPI.getAll()
//       ]);

//       if (employeesResponse?.success && Array.isArray(employeesResponse.result)) {
//         setEmployees(employeesResponse.result);
//       } else {
//         console.error('Unexpected API response for employees:', employeesResponse);
//       }

//       if (statusHistoryResponse?.success && Array.isArray(statusHistoryResponse.result)) {
//         setStatusHistory(statusHistoryResponse.result);
//       } else {
//         console.error('Unexpected API response for status history:', statusHistoryResponse);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to get active employee IDs from status history
//   const getActiveEmployeeIds = () => {
//     const activeIds = new Set();
    
//     statusHistory.forEach((history) => {
//       // Check if status is "Active" only
//       if (history.status === 'Active') {
//         const employeeId = history.employment_details?.employee_id;
//         if (employeeId) {
//           activeIds.add(employeeId);
//         }
//       }
//     });
    
//     return activeIds;
//   };

//   // Filter employees to show only active ones
//   const getActiveEmployees = () => {
//     const activeIds = getActiveEmployeeIds();
//     return employees.filter(emp => activeIds.has(emp.employee_id));
//   };

//   const activeEmployees = getActiveEmployees();

//   // ✅ Handle view details - store employee ID and switch view
//   const handleViewEmployee = (employeeId) => {
//     console.log('=== ONBOARDING - HANDLE VIEW EMPLOYEE ===');
//     console.log('Received employeeId:', employeeId);
//     console.log('Type:', typeof employeeId);
//     setSelectedEmployeeId(employeeId);
//     console.log('Set selectedEmployeeId to:', employeeId);
//     setCurrentView('details');
//     console.log('Changed view to: details');
//   };

//   const handleEditEmployee = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
//     setCurrentView('edit');
//   };

//   const handleBackToTable = () => {
//     setCurrentView('table');
//     setSelectedEmployeeId(null);
//     setSelectedEmployee(null);
//     loadEmployeesAndStatus(); // Refresh the list
//   };

//   const handleDeleteEmployee = async (employeeId) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         const response = await EmployeeMasterAPI.delete(employeeId);
//         console.log(response);

//         if (response?.success) {
//           loadEmployeesAndStatus(); // Refresh the list
//         } else {
//           alert('Failed to delete employee');
//         }
//       } catch (error) {
//         console.error('Error deleting employee:', error);
//         alert('Error deleting employee');
//       }
//     }
//   };

//   const handleUpdateEmployee = async (updatedEmployee) => {
//     try {
//       const response = await EmployeeMasterAPI.update(updatedEmployee);
//       console.log(response);
//       if (response?.success) {
//         loadEmployeesAndStatus();
//         setCurrentView('table');
//         setSelectedEmployee(null);
//       } else {
//         alert('Failed to update employee');
//       }
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const handleAddEmployee = async (newEmployee) => {
//     try {
//       const response = await EmployeeMasterAPI.add(newEmployee);
//       if (response?.success) {
//         loadEmployeesAndStatus();
//         setShowAddModal(false);
//       } else {
//         alert('Failed to add employee');
//       }
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const handleAction = (action, data) => {
//     console.log('Action:', action, 'Data:', data);
//     if (action === 'view') {
//       handleViewEmployee(data);
//     } else if (action === 'edit') {
//       handleEditEmployee(data);
//       console.log(data);
//     }
//   };

//   if (currentView === 'details') {
//     console.log('=== RENDERING DETAILS VIEW ===');
//     console.log('Passing employeeId:', selectedEmployeeId);
//     return (
//       <EmployeeDetailsView
//         employeeId={selectedEmployeeId}
//         onBack={handleBackToTable} 
//       />
//     );
//   }

//   if (currentView === 'edit') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <EmployeeModal
//           type="edit"
//           employeeId={selectedEmployeeId}
//           isOpen={true}
//           onClose={handleBackToTable}
//           onSave={handleUpdateEmployee}
//           hideSearch={true}
//         />
//       </div>
//     );
//   }

//   // ✅ Calculate stats - using only active employees
//   const probationaryCount = activeEmployees.filter(
//     emp => emp.employment_details?.is_probation
//   ).length;

//   const permanentCount = activeEmployees.filter(
//     emp => !emp.employment_details?.is_probation
//   ).length;

//   const thisMonthJoiners = activeEmployees.filter(emp => {
//     const joiningDate = new Date(emp.employment_details?.date_of_joining);
//     const now = new Date(); 
//     return joiningDate.getMonth() === now.getMonth() && 
//            joiningDate.getFullYear() === now.getFullYear();
//   }).length;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
//           <p className="text-gray-600 mt-1">Manage new employee onboarding and probation</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Employee
//         </button>
//       </div>

//       {/* Stats - Now showing only active employees */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
//               <p className="text-gray-600 text-sm">Active Employees</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
//               <Clock className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{probationaryCount}</p>
//               <p className="text-gray-600 text-sm">On Probation</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <UserCheck className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{permanentCount}</p>
//               <p className="text-gray-600 text-sm">Permanent</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{thisMonthJoiners}</p>
//               <p className="text-gray-600 text-sm">Joined This Month</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Employee Table Component - Passing only active employees */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading employees...</p>
//         </div>
//       ) : (
//         <EmployeeManagementTable
//           employees={activeEmployees}
//           onViewDetails={handleViewEmployee}
//           onAction={handleAction}
//           onDelete={handleDeleteEmployee}
//         />
//       )}

//       {/* Add Employee Modal */}
//       {showAddModal && (
//         <EmployeeModal
//           type="add"
//           isOpen={showAddModal}
//           onClose={() => setShowAddModal(false)}
//           onSave={handleAddEmployee}
//         />
//       )}
//     </div>
//   );
// };

// export default EmployeesManagement;



// import React, { useState, useEffect } from 'react';
// import { Users, Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Phone, Mail, X, ArrowLeft } from 'lucide-react';
// import { formatDate } from '../../utils/helpers';
// import EmployeeTable from './onboarding/EmployeeTable';
// import EmployeeDetailsView from './onboarding/EmployeeDetailsView';
// import EmployeeModal from './onboarding/EmployeeModal';
// import { EmployeeMasterAPI } from '../../api/employeeMaster';

// const EmployeesManagement = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentView, setCurrentView] = useState('table'); // 'table', 'details', 'edit'
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   // ✅ Fetch employees from API
//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   const loadEmployees = async () => {
//     try {
//       setLoading(true);
//       const response = await EmployeeMasterAPI.getAll();
//       if (response?.success && Array.isArray(response.result)) {
//         // Filter only permanent employees (not on probation)
//         const permanentEmployees = response.result.filter(
//           emp => !emp.employment_details?.is_probation
//         );
//         setEmployees(permanentEmployees);
//       } else {
//         console.error('Unexpected API response:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle view details - store employee ID and switch view
//   const handleViewEmployee = (employeeId) => {
//     console.log('=== HANDLE VIEW EMPLOYEE ===');
//     console.log('Received employeeId:', employeeId);
//     console.log('Type:', typeof employeeId);
//     setSelectedEmployeeId(employeeId);
//     console.log('Set selectedEmployeeId to:', employeeId);
//     setCurrentView('details');
//     console.log('Changed view to: details');
//   };


//   // ✅ Handle edit - fetch full employee data and switch view
//   const handleEditEmployee = async (employeeId) => {
//     try {
//       const response = await EmployeeMasterAPI.getById(employeeId);
//       if (response?.success && response.result) {
//         setSelectedEmployee(response.result);
//         setCurrentView('edit');
//       }
//     } catch (error) {
//       console.error('Error fetching employee for edit:', error);
//     }
//   };

  
//   // ✅ Go back to table view
//   const handleBackToTable = () => {
//     setCurrentView('table');
//     setSelectedEmployeeId(null);
//     setSelectedEmployee(null);
//     loadEmployees(); // Refresh the list
//   };

//   // ✅ Handle delete 
//   const handleDeleteEmployee = async (employeeId) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         const response = await EmployeeMasterAPI.delete(employeeId);

//         if (response?.success) {
//           loadEmployees(); // Refresh the list
//         } else {
//           alert('Failed to delete employee'); 
//         }
//       } catch (error) {
//         console.error('Error deleting employee:', error);
//         alert('Error deleting employee');
//       }
//     }
//   };

//   // ✅ Handle update employee
//   const handleUpdateEmployee = async (updatedEmployee) => {
//     try {
//       const response = await EmployeeMasterAPI.update(updatedEmployee);
//       if (response?.success) {
//         loadEmployees();
//         setCurrentView('table');
//         setSelectedEmployee(null);
//       } else {
//         alert('Failed to update employee');
//       }
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   // ✅ Handle action from EmployeeTable
//   const handleAction = (action, data) => {
//     console.log('Action:', action, 'Data:', data);
//     if (action === 'view') {
//       handleViewEmployee(data);
//     } else if (action === 'edit') {
//       handleEditEmployee(data);
//     }
//   };

//   // ✅ Show employee details view
//   if (currentView === 'details') {
//     return (
//       <EmployeeDetailsView
//         employeeId={selectedEmployeeId}
//         onBack={handleBackToTable}
//       />
//     );
//   }

//   // ✅ Show employee edit modal
//   if (currentView === 'edit') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <EmployeeModal
//           type="edit"
//           employee={selectedEmployee}
//           isOpen={true}
//           onClose={handleBackToTable}
//           onSave={handleUpdateEmployee}
//         />
//       </div>
//     );
//   }

//   // ✅ Calculate stats
//   const departments = [...new Set(
//     employees
//       .map(emp => emp.employment_details?.department?.name)
//       .filter(Boolean)
//   )];

//   const newJoiners = employees.filter(emp => {
//     const joiningDate = new Date(emp.employment_details?.date_of_joining);
//     const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
//     return monthsWorked < 12;
//   }).length;

//   const experienced = employees.filter(emp => {
//     const joiningDate = new Date(emp.employment_details?.date_of_joining);
//     const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
//     return monthsWorked >= 12;
//   }).length;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Permanent Employees</h1>
//           <p className="text-gray-600 mt-1">Manage your organization's permanent employees</p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
//               <p className="text-gray-600 text-sm">Permanent Employees</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
//               <p className="text-gray-600 text-sm">Departments</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{newJoiners}</p>
//               <p className="text-gray-600 text-sm">New Joiners (&lt; 1 year)</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{experienced}</p>
//               <p className="text-gray-600 text-sm">Experienced (&gt; 1 year)</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Employee Table Component */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading employees...</p>
//         </div>
//       ) : (
//         <EmployeeTable
//           onViewDetails={handleViewEmployee}
//           onAction={handleAction}
//           onDelete={handleDeleteEmployee}
//         />
//       )}
//     </div>
//   );
// };

// export default EmployeesManagement;





















































// // import React, { useState, useEffect } from 'react';
// // import { Users, Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Phone, Mail, X, ArrowLeft } from 'lucide-react';
// // import { formatDate } from '../../utils/helpers';
// // import EmployeeTable from './onboarding/EmployeeTable';
// // import EmployeeDetailsView from './onboarding/EmployeeDetailsView';
// // import EmployeeModal from './onboarding/EmployeeModal';
// // import { EmployeeMasterAPI } from '../../api/EmployeeMaster';

// // const EmployeesManagement = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [currentView, setCurrentView] = useState('table'); // 'table', 'details', 'edit'
// //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);

// //   // ✅ Fetch employees from API
// //   useEffect(() => {
// //     loadEmployees();
// //   }, []);

// //   const loadEmployees = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await EmployeeMasterAPI.getAll();
// //       if (response?.success && Array.isArray(response.result)) {
// //         // Filter only permanent employees (not on probation)
// //         const permanentEmployees = response.result.filter(
// //           emp => !emp.employment_details?.is_probation
// //         );
// //         setEmployees(permanentEmployees);
// //       } else {
// //         console.error('Unexpected API response:', response);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching employees:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Handle view details - store employee ID and switch view
// //   const handleViewEmployee = (employeeId) => {
// //     console.log('Viewing employee ID:', employeeId); // Debug log
// //     setSelectedEmployeeId(employeeId);
// //     setCurrentView('details');
// //   };

// //   // ✅ Handle edit - fetch full employee data and switch view
// //   const handleEditEmployee = async (employeeId) => {
// //     try {
// //       const response = await EmployeeMasterAPI.getById(employeeId);
// //       if (response?.success && response.result) {
// //         setSelectedEmployee(response.result);
// //         setCurrentView('edit');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching employee for edit:', error);
// //     }
// //   };

// //   // ✅ Go back to table view
// //   const handleBackToTable = () => {
// //     setCurrentView('table');
// //     setSelectedEmployeeId(null);
// //     setSelectedEmployee(null);
// //     loadEmployees(); // Refresh the list
// //   };

// //   // ✅ Handle delete
// //   const handleDeleteEmployee = async (employeeId) => {
// //     if (window.confirm('Are you sure you want to delete this employee?')) {
// //       try {
// //         const response = await EmployeeMasterAPI.delete(employeeId);
// //         if (response?.success) {
// //           loadEmployees(); // Refresh the list
// //         } else {
// //           alert('Failed to delete employee');
// //         }
// //       } catch (error) {
// //         console.error('Error deleting employee:', error);
// //         alert('Error deleting employee');
// //       }
// //     }
// //   };

// //   // ✅ Handle update employee
// //   const handleUpdateEmployee = async (updatedEmployee) => {
// //     try {
// //       const response = await EmployeeMasterAPI.update(updatedEmployee);
// //       if (response?.success) {
// //         loadEmployees();
// //         setCurrentView('table');
// //         setSelectedEmployee(null);
// //       } else {
// //         alert('Failed to update employee');
// //       }
// //     } catch (error) {
// //       console.error('Error updating employee:', error);
// //       alert('Error updating employee');
// //     }
// //   };

// //   // ✅ Handle action from EmployeeTable
// //   const handleAction = (action, data) => {
// //     console.log('Action:', action, 'Data:', data);
// //     if (action === 'view') {
// //       handleViewEmployee(data);
// //     } else if (action === 'edit') {
// //       handleEditEmployee(data);
// //     }
// //   };

// //   // ✅ Show employee details view
// //   if (currentView === 'details') {
// //     return (
// //       <EmployeeDetailsView
// //         employeeId={selectedEmployeeId}
// //         onBack={handleBackToTable}
// //       />
// //     );
// //   }

// //   // ✅ Show employee edit modal
// //   if (currentView === 'edit') {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <EmployeeModal
// //           type="edit"
// //           employee={selectedEmployee}
// //           isOpen={true}
// //           onClose={handleBackToTable}
// //           onSave={handleUpdateEmployee}
// //         />
// //       </div>
// //     );
// //   }

// //   // ✅ Calculate stats
// //   const departments = [...new Set(
// //     employees
// //       .map(emp => emp.employment_details?.department?.name)
// //       .filter(Boolean)
// //   )];

// //   const newJoiners = employees.filter(emp => {
// //     const joiningDate = new Date(emp.employment_details?.date_of_joining);
// //     const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
// //     return monthsWorked < 12;
// //   }).length;

// //   const experienced = employees.filter(emp => {
// //     const joiningDate = new Date(emp.employment_details?.date_of_joining);
// //     const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
// //     return monthsWorked >= 12;
// //   }).length;

// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Permanent Employees</h1>
// //           <p className="text-gray-600 mt-1">Manage your organization's permanent employees</p>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
// //               <p className="text-gray-600 text-sm">Permanent Employees</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
// //               <p className="text-gray-600 text-sm">Departments</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{newJoiners}</p>
// //               <p className="text-gray-600 text-sm">New Joiners (&lt; 1 year)</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{experienced}</p>
// //               <p className="text-gray-600 text-sm">Experienced (&gt; 1 year)</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Employee Table Component */}
// //       {loading ? (
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading employees...</p>
// //         </div>
// //       ) : (
// //         <EmployeeTable
// //           onViewDetails={handleViewEmployee}
// //           onAction={handleAction}
// //           onDelete={handleDeleteEmployee}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeesManagement;



























































// // import React, { useState, useEffect } from 'react';
// // import { Users, Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Phone, Mail, X, ArrowLeft } from 'lucide-react';
// // import { getFromStorage, saveToStorage } from '../../utils/localStorage';
// // import { formatDate, isPermanent } from '../../utils/helpers';
// // import EmployeeDetailsPage from './EmployeeDetailsPage';
// // import EmployeeModal from './onboarding/EmployeeModal';
// // import EmployeeDetailsView from './onboarding/EmployeeDetailsView';

// // const EmployeesManagement = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterDepartment, setFilterDepartment] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [currentView, setCurrentView] = useState('table'); // 'table', 'details', 'edit'
// //   const [modalType, setModalType] = useState(null); // 'edit'
// //   const employeesPerPage = 10;

// //   useEffect(() => {
// //     loadEmployees();
// //   }, []);

// //   const loadEmployees = () => {
// //     const employeesData = getFromStorage('employees') || [];
// //     // Filter only permanent employees (exclude probationary and not decided)
// //     const permanentEmployees = employeesData.filter(emp => isPermanent(emp));
// //     setEmployees(permanentEmployees);
// //   };

// //   const departments = [...new Set(employees.map(emp => emp.employmentDetails?.department).filter(Boolean))];

// //   const filteredEmployees = employees.filter(employee => {
// //     const matchesSearch = !searchTerm || 
// //       employee.personalDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       employee.personalDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       employee.employmentDetails?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
// //     const matchesDepartment = !filterDepartment || employee.employmentDetails?.department === filterDepartment;

// //     return matchesSearch && matchesDepartment;
// //   });

// //   const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
// //   const startIndex = (currentPage - 1) * employeesPerPage;
// //   const currentEmployees = filteredEmployees.slice(startIndex, startIndex + employeesPerPage);

// //   // Handle view details - switch to details page (same as OnboardingManagement)
// //   const handleViewEmployee = (employee) => {
// //     setSelectedEmployee(employee);
// //     setCurrentView('details');
// //   };

// //   // Handle edit - switch to edit page (same as OnboardingManagement)
// //   const handleEditEmployee = (employee) => {
// //     setSelectedEmployee(employee);
// //     setCurrentView('edit');
// //   };

// //   // Go back to table view (same as OnboardingManagement)
// //   const handleBackToTable = () => {
// //     setCurrentView('table');
// //     setSelectedEmployee(null);
// //   };

// //   const handleDeleteEmployee = (employeeId) => {
// //     if (window.confirm('Are you sure you want to delete this employee?')) {
// //       const allEmployees = getFromStorage('employees') || [];
// //       const updatedEmployees = allEmployees.filter(emp => emp.id !== employeeId);
// //       saveToStorage('employees', updatedEmployees);
// //       loadEmployees();
// //     }
// //   };

// //   const handleUpdateEmployee = (updatedEmployee) => {
// //     const allEmployees = getFromStorage('employees') || [];
// //     const updatedEmployees = allEmployees.map(emp => 
// //       emp.id === updatedEmployee.id ? updatedEmployee : emp
// //     );
// //     saveToStorage('employees', updatedEmployees);
// //     loadEmployees();
// //     setShowEditModal(false);
// //     setSelectedEmployee(null);
// //     setModalType(null);
// //     // Go back to table after successful update
// //     setCurrentView('table');
// //   };

// //   // Close modal (same as OnboardingManagement)
// //   const closeModal = () => {
// //     setShowEditModal(false);
// //     setModalType(null);
// //     setSelectedEmployee(null);
// //   };

// //   // Show employee details page when currentView is 'details' (same as OnboardingManagement)
// //   if (currentView === 'details') {
// //     return (
// //       <EmployeeDetailsPage
// //         employeeId={selectedEmployee.id}
// //         onBack={handleBackToTable}
// //         onEdit={handleEditEmployee}
// //       />
// //     );
// //   }

// //   // Show employee edit page when currentView is 'edit' (same as OnboardingManagement)
// //   if (currentView === 'edit') {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <EmployeeModal
// //           type="edit"
// //           employee={selectedEmployee}
// //           isOpen={true}
// //           onClose={handleBackToTable}
// //           onSave={handleUpdateEmployee}
// //         />
// //       </div>
// //     );
// //   }

// //   const AddEmployeeModal = () => {
// //     const [formData, setFormData] = useState({
// //       fullName: '',
// //       email: '',
// //       phone: '',
// //       department: '',
// //       designation: '',
// //       joiningDate: ''
// //     });

// //     const handleSubmit = (e) => {
// //       e.preventDefault();
// //       const newEmployee = {
// //         id: `EMP${Date.now()}`,
// //         personalDetails: {
// //           fullName: formData.fullName,
// //           email: formData.email,
// //           mobileNumber: formData.phone
// //         },
// //         employmentDetails: {
// //           employeeId: `EMP${Date.now()}`,
// //           department: formData.department,
// //           designation: formData.designation,
// //           joiningDate: formData.joiningDate,
// //           employeeStatus: 'Permanent' // New employees added here are permanent
// //         },
// //         createdAt: new Date().toISOString()
// //       };

// //       const allEmployees = getFromStorage('employees') || [];
// //       const updatedEmployees = [...allEmployees, newEmployee];
// //       saveToStorage('employees', updatedEmployees);
// //       loadEmployees();
// //       setShowAddModal(false);
// //       setFormData({
// //         fullName: '',
// //         email: '',
// //         phone: '',
// //         department: '',
// //         designation: '',
// //         joiningDate: ''
// //       });
// //     };

// //     if (!showAddModal) return null;

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold">Add New Employee</h3>
// //             <button 
// //               onClick={() => setShowAddModal(false)}
// //               className="text-gray-400 hover:text-gray-600"
// //             >
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <input
// //               type="text"
// //               placeholder="Full Name"
// //               value={formData.fullName}
// //               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <input
// //               type="email"
// //               placeholder="Email"
// //               value={formData.email}
// //               onChange={(e) => setFormData({...formData, email: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <input
// //               type="tel"
// //               placeholder="Phone"
// //               value={formData.phone}
// //               onChange={(e) => setFormData({...formData, phone: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Department"
// //               value={formData.department}
// //               onChange={(e) => setFormData({...formData, department: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Designation"
// //               value={formData.designation}
// //               onChange={(e) => setFormData({...formData, designation: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <input
// //               type="date"
// //               value={formData.joiningDate}
// //               onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
// //               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
// //               required
// //             />
// //             <div className="flex space-x-3">
// //               <button
// //                 type="submit"
// //                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
// //               >
// //                 Add Employee
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setShowAddModal(false)}
// //                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Permanent Employees</h1>
// //           <p className="text-gray-600 mt-1">Manage your organization's permanent employees</p>
// //         </div>
// //         <button
// //           onClick={() => setShowAddModal(true)}
// //           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
// //         >
// //           <Plus className="w-4 h-4 mr-2" />
// //           Add Employee
// //         </button>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
// //               <p className="text-gray-600 text-sm">Permanent Employees</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
// //               <p className="text-gray-600 text-sm">Departments</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">
// //                 {employees.filter(emp => {
// //                   const joiningDate = new Date(emp.employmentDetails?.joiningDate);
// //                   const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
// //                   return monthsWorked < 12;
// //                 }).length}
// //               </p>
// //               <p className="text-gray-600 text-sm">New Joiners ({'<'} 1 year)</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// //           <div className="flex items-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
// //               <Users className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-2xl font-bold text-gray-900">
// //                 {employees.filter(emp => {
// //                   const joiningDate = new Date(emp.employmentDetails?.joiningDate);
// //                   const monthsWorked = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
// //                   return monthsWorked >= 12;
// //                 }).length}
// //               </p>
// //               <p className="text-gray-600 text-sm">Experienced ({'>'} 1 year)</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// //         <div className="flex flex-col sm:flex-row gap-4">
// //           <div className="flex-1">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search employees..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
// //               />
// //             </div>
// //           </div>
// //           <select
// //             value={filterDepartment}
// //             onChange={(e) => setFilterDepartment(e.target.value)}
// //             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
// //           >
// //             <option value="">All Departmentssss</option>
// //             {departments.map(dept => (
// //               <option key={dept} value={dept}>{dept}</option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       {/* Employees Table */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Employee
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Contact
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Department
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Joining Date
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {currentEmployees.length > 0 ? (
// //                 currentEmployees.map((employee) => (
// //                   <tr key={employee.id} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-900">
// //                           {employee.personalDetails?.fullName || 'N/A'}
// //                         </div>
// //                         <div className="text-sm text-gray-500">
// //                           {employee.employmentDetails?.designation || 'N/A'}
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-900">
// //                         {employee.personalDetails?.email || 'N/A'}
// //                       </div>
// //                       <div className="text-sm text-gray-500">
// //                         {employee.personalDetails?.mobileNumber || 'N/A'}
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-900">
// //                         {employee.employmentDetails?.department || 'N/A'}
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-900">
// //                         {formatDate(employee.employmentDetails?.joiningDate)}
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center space-x-2">
// //                         <button 
// //                           onClick={() => handleViewEmployee(employee)}
// //                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
// //                           title="View Employee"
// //                         >
// //                           <Eye className="w-4 h-4" />
// //                         </button>
// //                         <button 
// //                           onClick={() => handleEditEmployee(employee)}
// //                           className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
// //                           title="Edit Employee"
// //                         >
// //                           <Edit className="w-4 h-4" />
// //                         </button>
// //                         <button 
// //                           onClick={() => handleDeleteEmployee(employee.id)}
// //                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
// //                           title="Delete Employee"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
// //                     <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
// //                     <p className="text-lg font-medium">No permanent employees found</p>
// //                     <p className="text-sm">Add your first employee or check probationary employees section</p>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pagination */}
// //         {totalPages > 1 && (
// //           <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// //             <div className="text-sm text-gray-700">
// //               Showing {startIndex + 1} to {Math.min(startIndex + employeesPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
// //             </div>
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// //                 disabled={currentPage === 1}
// //                 className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //               >
// //                 Previous
// //               </button>
// //               <span className="px-3 py-1 bg-orange-600 text-white rounded-lg">
// //                 {currentPage}
// //               </span>
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// //                 disabled={currentPage === totalPages}
// //                 className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modals */}
// //       <AddEmployeeModal />
// //     </div>
// //   );
// // };

// // export default EmployeesManagement;