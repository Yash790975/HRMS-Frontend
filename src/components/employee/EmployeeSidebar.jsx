import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, User, Calendar, Clock, CheckSquare, Briefcase, 
  TrendingUp, Users, Video, DollarSign, Receipt, 
  FileText, Award, Gift, HelpCircle, Settings, X 
} from 'lucide-react';
 
const EmployeeSidebar = ({ isOpen, setIsOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Leave Management', href: '/leave', icon: Calendar },
    { name: 'Attendance', href: '/attendance', icon: Clock },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    // { name: 'Performance', href: '/performance', icon: TrendingUp }, not in use
    // { name: 'Team', href: '/team', icon: Users },
    // { name: 'Meetings', href: '/meetings', icon: Video }, not in use
    { name: 'Payroll', href: '/payroll', icon: DollarSign },
    { name: 'Expenses', href: '/expenses', icon: Receipt },

    { name: 'Assets', href: '/assets', icon: Receipt },

    // { name: 'Documents', href: '/documents', icon: FileText }, not in use
    { name: 'Benefits', href: '/benefits', icon: Gift },
    { name: 'Help Desk', href: '/helpdesk', icon: HelpCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}   
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Employee Portal</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-1 overflow-y-auto h-[80vh] sm:overflow-y-visible sm:h-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      // ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default EmployeeSidebar;