import React from 'react';
 import { Routes, Route } from 'react-router-dom';
 import ManagerLayout from '../components/manager/ManagerLayout';
 import Dashboard from '../components/manager/Dashboard';
import LeaveManagement from '../components/manager/LeaveManagement';
import AttendanceMonitoring from '../components/manager/AttendanceMonitoring';
import TimesheetApproval from '../components/manager/TimesheetApproval';
import TeamDetails from '../components/manager/TeamDetails';
import PerformanceManagement from '../components/manager/PerformanceManagement';
import TaskAllocation from '../components/manager/TaskAllocation';
import Notifications from '../components/manager/Notifications';
import Reports from '../components/manager/Reports';
import ExpenseApproval from '../components/manager/ExpenseApproval';
// import Profile from '../components/manager/Profile';


const ManagerPortal = () => {
  return (
    <ManagerLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/my-profile" element={<Profile />} /> */}
        <Route path="/leave-management" element={<LeaveManagement />} />
        <Route path="/attendance" element={<AttendanceMonitoring />} />
        <Route path="/timesheet" element={<TimesheetApproval />} />
        <Route path="/team-details" element={<TeamDetails />} />
        <Route path="/performance" element={<PerformanceManagement />} />
        <Route path="/tasks" element={<TaskAllocation />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/expenses" element={<ExpenseApproval />} />
      </Routes>
    </ManagerLayout>
    
  );
};

export default ManagerPortal;