import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Menu, X, UserPlus, ChevronDown, Settings } from 'lucide-react';
import Sidebar from './Sidebar';

 
const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleAddAdmin = () => {
    setShowProfileMenu(false);
    navigate('/admin/admin-users');
  };

  return (
    <>
    {/* <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg"> */}
    <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex justify-between items-center h-16 px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-black/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className={`flex items-center ${sidebarOpen ? 'lg:block hidden' : 'block'}`}>
            <h1 className="text-xl font-bold bg-gradient-to-r text-orange-700 to-pink-900 bg-clip-text text-transparent drop-shadow-md">
              Dashboard
            </h1>
          </div>

        
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-white bg-transparent hover:bg-white/10 focus:outline-none rounded-full px-3 py-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center ring-2 ring-white/50 shadow-lg">
                      <User className="h-4 w-4 text-orange-700" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <span className="text-sm font-semibold hidden sm:block drop-shadow-sm text-black">
                    {user?.name || user?.email}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 hidden sm:block text-black transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <>
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-purple-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-orange-700 flex items-center justify-center ring-2 ring-purple-200 shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.name || 'Admin User'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleAddAdmin}
                        className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 flex items-center space-x-3 transition-all duration-150 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <UserPlus className="w-4 h-4 text-orange-700" />
                        </div>
                        <span className="font-medium">Manage Admin Users</span>
                      </button>

                      {/* <button
                        onClick={() => {
                          navigate('/admin/user-profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 flex items-center space-x-3 transition-all duration-150 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                          <Settings className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="font-medium">User Profiles</span>
                      </button> */}
                    </div>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-all duration-150 group rounded-b-2xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
                    onClick={() => setShowProfileMenu(false)}
                  />
                </>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="sm:hidden inline-flex items-center p-2 border-2 border-white/30 rounded-full text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      
    </>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 lg:ml-0">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;



