import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/hr/Sidebar';
import Header from '../components/hr/Header';
import Dashboard from '../components/hr/Dashboard';
import MyProfile from '../components/hr/MyProfile';
import OnboardingManagement from '../components/hr/OnboardingManagement';
import EmployeesManagement from '../components/hr/EmployeesManagement';
import AttendanceManagement from '../components/hr/AttendanceManagement';
import LeaveManagement from '../components/hr/LeaveManagement';
import PayrollManagement from '../components/hr/PayrollManagement';
import ExpensesManagement from '../components/hr/ExpensesManagement';
import AssetsManagement from '../components/hr/AssetsManagement';
import BenefitsManagement from '../components/hr/BenefitsManagement';
import ProbationaryEmployees from '../components/hr/ProbationaryEmployees';
import DepartmentManagement from '../components/hr/DepartmentManagement';
import DesignationManagement from '../components/hr/DesignationManagement';
import AdminUsers from '../components/hr/AdminUsers';
import OfficeLocationManagement from '../components/hr/OfficeLocationManagement';
// import {RoleManagement} from '../components/hr/RoleManagement';
import RoleManagement from '../components/hr/RoleManagement';


const HRPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */} 
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/hr-portal/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/onboarding" element={<OnboardingManagement />} />
            <Route path="/employees" element={<EmployeesManagement />} />
            <Route path="/Probationary" element={<ProbationaryEmployees/>} />
            <Route path="/attendance" element={<AttendanceManagement />} />
            <Route path="/leave" element={<LeaveManagement />} />
            <Route path="/payroll" element={<PayrollManagement />} />
            <Route path="/expenses" element={<ExpensesManagement />} />
            <Route path="/assets" element={<AssetsManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/designations" element={<DesignationManagement />} />
            <Route path="/office-location" element={<OfficeLocationManagement />} />
            <Route path="/role-management" element={<RoleManagement />} />


            {/* <Route path="/benefits" element={<BenefitsManagement />} /> */}
            <Route path="/adminusers" element={<AdminUsers/>} />


          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HRPortal;