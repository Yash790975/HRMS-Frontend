import React, { useState } from 'react';
import EmployeeTable from './EmployeeTable';
import EmployeeDetailsView from './EmployeeDetailsView';
import EmployeeModal from './EmployeeModal'; // Your existing modal for edit functionality

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]); // Your employee data
  const [currentView, setCurrentView] = useState('table'); // 'table', 'details'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit' only now
  const [showModal, setShowModal] = useState(false);

  // Handle view details - switch to details page
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setCurrentView('details');
  };
  
  // Handle edit - still use modal
  const handleAction = (type, employee) => {
    if (type === 'edit') {
      setSelectedEmployee(employee);
      setModalType(type);
      setShowModal(true);
    }
  };

  // Go back to table view
  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedEmployee(null);
  };

  // Handle delete
  const handleDelete = (employeeId) => {
    // Your delete logic
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedEmployee(null);
  };

  if (currentView === 'details') {
    return (
      <EmployeeDetailsView
        employee={selectedEmployee}
        onBack={handleBackToTable}
      />
    );
  }

  return (
    <div className="p-6">
      <EmployeeTable
        employees={employees}
        onAction={handleAction}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      {/* Keep your existing modal for edit functionality */}
      {showModal && (
        <EmployeeModal
          type={modalType}
          employee={selectedEmployee}
          onClose={closeModal}
          onSave={(updatedEmployee) => {
            // Handle save logic
            const updatedEmployees = employees.map(emp =>
              emp.id === updatedEmployee.id ? updatedEmployee : emp
            );
            setEmployees(updatedEmployees);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;