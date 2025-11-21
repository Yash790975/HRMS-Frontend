import React, { useState, useEffect } from 'react';
import { Users, Plus, UserCheck, Clock } from 'lucide-react';
import EmployeeTable from './onboarding/EmployeeTable';
import EmployeeDetailsView from './onboarding/EmployeeDetailsView';
import EmployeeModal from './onboarding/EmployeeModal';
import { EmployeeMasterAPI } from '../../api/employeeMaster';

const OnboardingManagement = () => { 
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('table'); // 'table', 'details', 'edit'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Fetch employees from API
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await EmployeeMasterAPI.getAll();
      if (response?.success && Array.isArray(response.result)) {
        setEmployees(response.result);
      } else {
        console.error('Unexpected API response:', response);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

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
  setSelectedEmployeeId(employeeId);  // Store the ID
  setCurrentView('edit');              // Switch to edit view
};

  // ✅ Go back to table view
  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedEmployeeId(null);
    setSelectedEmployee(null);
    loadEmployees(); // Refresh the list
  };

  // ✅ Handle delete
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await EmployeeMasterAPI.delete(employeeId);
        console.log(response)

        
        if (response?.success) {
          loadEmployees(); // Refresh the list
        } else {
          alert('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
      }
    }
  };

  // ✅ Handle update employee
  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const response = await EmployeeMasterAPI.update(updatedEmployee);
      console.log(response)
      if (response?.success) {
        loadEmployees();
        setCurrentView('table');
        setSelectedEmployee(null);
      } else {
        alert('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
  };

  // ✅ Handle add employee
  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await EmployeeMasterAPI.add(newEmployee);
      if (response?.success) {
        loadEmployees();
        setShowAddModal(false);
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  // ✅ Handle action from EmployeeTable
  const handleAction = (action, data) => {
    console.log('Action:', action, 'Data:', data);
    if (action === 'view') {
      handleViewEmployee(data);
    } else if (action === 'edit') {
      handleEditEmployee(data);
      console.log(data)
    }
  };

  

  // ✅ Show employee details view
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


  //  Show employee edit modal
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

  // ✅ Calculate stats
  const probationaryCount = employees.filter(
    emp => emp.employment_details?.is_probation
  ).length;

  const permanentCount = employees.filter(
    emp => !emp.employment_details?.is_probation
  ).length;

  const thisMonthJoiners = employees.filter(emp => {
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              <p className="text-gray-600 text-sm">Total Employees</p>
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

      {/* Employee Table Component */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : (
        <EmployeeTable
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
    </div>
  );
};

export default OnboardingManagement;

