import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ITSidebar from '../components/it/ITSidebar';
import ITHeader from '../components/it/ITHeader';
import ITDashboard from '../components/it/ITDashboard';
import ITProfile from '../components/it/ITProfile';
import AssetManagement from '../components/it/AssetManagement';
import HelpDeskTicketing from '../components/it/HelpDeskTicketing';
import UserAccountManagement from '../components/it/UserAccountManagement';
import SystemAdministration from '../components/it/SystemAdministration';
import SoftwareLicenseManagement from '../components/it/SoftwareLicenseManagement';
import SecurityCompliance from '../components/it/SecurityCompliance';
import ReportsAnalytics from '../components/it/ReportsAnalytics';
import EmployeeSelfService from '../components/it/EmployeeSelfService';

const ITPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ITSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ITHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/it-portal/dashboard" replace />} />
            <Route path="/dashboard" element={<ITDashboard />} />
            <Route path="/profile" element={<ITProfile />} />
            <Route path="/assets" element={<AssetManagement />} />
            <Route path="/helpdesk" element={<HelpDeskTicketing />} />
            <Route path="/users" element={<UserAccountManagement />} />
            <Route path="/system" element={<SystemAdministration />} />
            <Route path="/software" element={<SoftwareLicenseManagement />} />
            <Route path="/security" element={<SecurityCompliance />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
            <Route path="/self-service" element={<EmployeeSelfService />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ITPortal;