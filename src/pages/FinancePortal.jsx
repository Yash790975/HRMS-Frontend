import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FinanceSidebar from '../components/finance/FinanceSidebar';
import FinanceHeader from '../components/finance/FinanceHeader';
import FinanceDashboard from '../components/finance/FinanceDashboard';
import FinanceProfile from '../components/finance/FinanceProfile';
import PayrollManagement from '../components/finance/PayrollManagement';
import ExpenseManagement from '../components/finance/ExpenseManagement';
import BudgetManagement from '../components/finance/BudgetManagement';
import AccountsPayable from '../components/finance/AccountsPayable';
import FinancialReporting from '../components/finance/FinancialReporting';
import ComplianceTaxation from '../components/finance/ComplianceTaxation';
import BenefitsAdministration from '../components/finance/BenefitsAdministration';
import AssetDepreciation from '../components/finance/AssetDepreciation';
import VendorManagement from '../components/finance/VendorManagement';
import EmployeeFinancialService from '../components/finance/EmployeeFinancialService';

const FinancePortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <FinanceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <FinanceHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/finance-portal/dashboard" replace />} />
            <Route path="/dashboard" element={<FinanceDashboard />} />
            <Route path="/profile" element={<FinanceProfile />} />
            <Route path="/payroll" element={<PayrollManagement />} />
            <Route path="/expenses" element={<ExpenseManagement />} />
            <Route path="/budget" element={<BudgetManagement />} />
            <Route path="/accounts-payable" element={<AccountsPayable />} />
            <Route path="/reporting" element={<FinancialReporting />} />
            <Route path="/compliance" element={<ComplianceTaxation />} />
            <Route path="/benefits" element={<BenefitsAdministration />} />
            <Route path="/assets" element={<AssetDepreciation />} />
            <Route path="/vendors" element={<VendorManagement />} />
            <Route path="/employee-service" element={<EmployeeFinancialService />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default FinancePortal;