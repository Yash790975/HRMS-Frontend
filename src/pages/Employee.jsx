import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeLayout from '../components/employee/EmployeeLayout';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import MyProfile from '../components/employee/MyProfile';

const EmployeePortal = () => {
  return (
    <EmployeeLayout>
      <Routes>
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        {/* Add other routes as needed */}
      </Routes>
    </EmployeeLayout>
  );
};

export default EmployeePortal;