import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  DollarSign, 
  Receipt, 
  PieChart, 
  CreditCard, 
  BarChart3,
  FileText,
  Gift,
  Package,
  Users,
  Settings,
  X,
  Calculator
} from 'lucide-react';

const FinanceSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/finance-portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/finance-portal/profile', icon: User, label: 'My Profile' },
    { path: '/finance-portal/payroll', icon: DollarSign, label: 'Payroll Management' },
    { path: '/finance-portal/expenses', icon: Receipt, label: 'Expense Management' },
    { path: '/finance-portal/budget', icon: PieChart, label: 'Budget Management' },
    { path: '/finance-portal/accounts-payable', icon: CreditCard, label: 'Accounts Payable' },
    { path: '/finance-portal/reporting', icon: BarChart3, label: 'Financial Reporting' },
    { path: '/finance-portal/compliance', icon: FileText, label: 'Compliance & Taxation' },
    { path: '/finance-portal/benefits', icon: Gift, label: 'Benefits Administration' },
    { path: '/finance-portal/assets', icon: Package, label: 'Asset & Depreciation' },
    { path: '/finance-portal/vendors', icon: Users, label: 'Vendor Management' },
    { path: '/finance-portal/employee-service', icon: Settings, label: 'Employee Financial Service' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Finance Portal</h1>
              <p className="text-sm text-gray-500">Finance Team</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default FinanceSidebar;