import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  Headphones, 
  Users, 
  Server, 
  Download,
  Shield,
  BarChart3,
  Settings,
  X,
  Monitor
} from 'lucide-react';

const ITSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/it-portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/it-portal/profile', icon: User, label: 'My Profile' },
    { path: '/it-portal/assets', icon: Package, label: 'Asset Management' },
    { path: '/it-portal/helpdesk', icon: Headphones, label: 'Help Desk & Tickets' },
    { path: '/it-portal/users', icon: Users, label: 'User Account Management' },
    { path: '/it-portal/system', icon: Server, label: 'System Administration' },
    { path: '/it-portal/software', icon: Download, label: 'Software & Licenses' },
    { path: '/it-portal/security', icon: Shield, label: 'Security & Compliance' },
    { path: '/it-portal/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { path: '/it-portal/self-service', icon: Settings, label: 'Employee Self-Service' },
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
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IT Portal</h1>
              <p className="text-sm text-gray-500">IT Team Member</p>
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

export default ITSidebar;