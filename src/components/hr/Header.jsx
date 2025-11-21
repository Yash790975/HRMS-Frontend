import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  UserPlus,
  Settings,
} from "lucide-react";

// const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {

const Header = ({ onMenuClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showAdminUser, setShowAdminUSer] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const handleAddAdmin = () => {
    setShowAdminUSer(false);
    navigate("/adminUser");
  };

  const handleAddProfile = () => {
    setShowProfileMenu(false);
    navigate("/myprofile");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees, departments..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
          </button>

          {/* User Menu with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 focus:outline-none rounded-lg px-3 py-2 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center ring-2 ring-orange-200 shadow-md">
                    <User className="h-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.designation || "Admin"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 hidden sm:block text-gray-600 transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center ring-2 ring-orange-200 shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.name || user?.username || "Admin User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/hr-portal/adminusers");
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 flex items-center space-x-3 transition-all duration-150 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <button
                        onClick={handleAddProfile}
                        className="font-medium"
                      >
                        Manage Admin Users
                      </button>
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-all duration-150 group rounded-b-2xl"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>

                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
                  onClick={() => setShowProfileMenu(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
