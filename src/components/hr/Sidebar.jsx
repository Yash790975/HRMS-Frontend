import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import HRMS_Logo from '../../assets/HRMS_Logo.JPG';
import { 
  LayoutDashboard, 
  User, 
  UserPlus, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  Receipt, 
  Package, 
  Gift,
  X,
  Building2
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/hr-portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    // { path: '/hr-portal/profile', icon: User, label: 'My Profile' },
    { path: '/hr-portal/onboarding', icon: UserPlus, label: 'Employee Onboarding' },

    { path: '/hr-portal/employees', icon: Users, label: 'Employees Management' },
    { path: '/hr-portal/Probationary', icon: Users, label: 'Probationary Employees' },
    { path: '/hr-portal/office-location', icon: Package, label: 'Office Location' },
    { path: '/hr-portal/role-management', icon: Users, label: 'Role Management' },
    // { path: '/hr-portal/adminusers', icon: Package, label: 'Manage Admin User' },
    { path: '/hr-portal/departments', icon: Users, label: 'Department Management' },
    { path: '/hr-portal/designations', icon: Users, label: 'Designation Management' },
    // { path: '/hr-portal/attendance', icon: Clock, label: 'Attendance Management' },
    // { path: '/hr-portal/leave', icon: Calendar, label: 'Leave Management' },
    // { path: '/hr-portal/payroll', icon: DollarSign, label: 'Payroll Management' },
    // { path: '/hr-portal/expenses', icon: Receipt, label: 'Expenses Management' },
    // { path: '/hr-portal/assets', icon: Package, label: 'Assets Management' },
    

    // { path: '/hr-portal/benefits', icon: Gift, label: 'Benefits Management' },
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


<div className={`
  fixed lg:static inset-y-0 left-0 z-30
  w-72 bg-white shadow-xl border-r border-gray-200
  transform transition-transform duration-300 ease-in-out
  overflow-y-auto
  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>


        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 w-full ">
            {/* <div className="w-40 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center"> */}
              {/* <Building2 className="w-6 h-6 text-white" />  */}
              <img 
                    src={HRMS_Logo} 
                    alt="HRMS Logo" 
                    className="w-full h-auto max-h-12 object-contain"
                  />
            {/* </div> */}
            <div>
              {/* <h1 className="text-xl font-bold text-gray-900">Vastorax</h1> */}
              {/* <p className="text-sm text-gray-500">Admin User</p> */}
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

export default Sidebar;