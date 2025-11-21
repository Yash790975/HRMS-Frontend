import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, User, Shield, Key, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const UserAccountManagement = () => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const accountStatuses = ['Active', 'Inactive', 'Suspended', 'Pending'];
  const userRoles = ['Employee', 'Manager', 'Admin', 'IT Support', 'HR', 'Finance'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const accountsData = getFromStorage('userAccounts') || [];
    
    setEmployees(employeesData);
    setUserAccounts(accountsData);

    // Generate sample user accounts if none exist
    if (accountsData.length === 0 && employeesData.length > 0) {
      generateSampleAccounts(employeesData);
    }
  };

  const generateSampleAccounts = (employeesData) => {
    const sampleAccounts = employeesData.map((employee, index) => ({
      id: `USR${String(index + 1).padStart(3, '0')}`,
      employeeId: employee.id,
      employeeName: employee.personalDetails?.fullName,
      username: employee.personalDetails?.email?.split('@')[0] || `user${index + 1}`,
      email: employee.personalDetails?.email,
      role: index === 0 ? 'Admin' : index === 1 ? 'Manager' : 'Employee',
      status: index === 4 ? 'Inactive' : 'Active',
      department: employee.employmentDetails?.department,
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: employee.employmentDetails?.joiningDate,
      passwordLastChanged: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      failedLoginAttempts: Math.floor(Math.random() * 3),
      accountLocked: false,
      permissions: {
        email: true,
        fileShare: true,
        vpn: index < 3,
        adminPanel: index === 0,
        hrSystem: index === 0 || index === 1
      }
    }));

    setUserAccounts(sampleAccounts);
    saveToStorage('userAccounts', sampleAccounts);
  };

  const filteredAccounts = userAccounts.filter(account => {
    const matchesSearch = !searchTerm || 
      account.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || account.status === filterStatus;
    const matchesRole = !filterRole || account.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const activeCount = userAccounts.filter(account => account.status === 'Active').length;
  const inactiveCount = userAccounts.filter(account => account.status === 'Inactive').length;
  const suspendedCount = userAccounts.filter(account => account.status === 'Suspended').length;
  const pendingCount = userAccounts.filter(account => account.status === 'Pending').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'IT Support': return 'bg-orange-100 text-orange-800';
      case 'HR': return 'bg-pink-100 text-pink-800';
      case 'Finance': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (accountId, newStatus) => {
    const updatedAccounts = userAccounts.map(account =>
      account.id === accountId
        ? { ...account, status: newStatus }
        : account
    );
    setUserAccounts(updatedAccounts);
    saveToStorage('userAccounts', updatedAccounts);
  };

  const handlePasswordReset = (accountId) => {
    const updatedAccounts = userAccounts.map(account =>
      account.id === accountId
        ? { 
            ...account, 
            passwordLastChanged: new Date().toISOString().split('T')[0],
            failedLoginAttempts: 0,
            accountLocked: false
          }
        : account
    );
    setUserAccounts(updatedAccounts);
    saveToStorage('userAccounts', updatedAccounts);
    alert('Password reset successfully. Temporary password sent to user email.');
  };

  const AddAccountModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      username: '',
      role: 'Employee',
      permissions: {
        email: true,
        fileShare: true,
        vpn: false,
        adminPanel: false,
        hrSystem: false
      }
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

      const newAccount = {
        id: `USR${String(userAccounts.length + 1).padStart(3, '0')}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        username: formData.username,
        email: selectedEmployee?.personalDetails?.email,
        role: formData.role,
        status: 'Pending',
        department: selectedEmployee?.employmentDetails?.department,
        lastLogin: null,
        createdDate: new Date().toISOString().split('T')[0],
        passwordLastChanged: new Date().toISOString().split('T')[0],
        failedLoginAttempts: 0,
        accountLocked: false,
        permissions: formData.permissions
      };

      const updatedAccounts = [...userAccounts, newAccount];
      setUserAccounts(updatedAccounts);
      saveToStorage('userAccounts', updatedAccounts);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        username: '',
        role: 'Employee',
        permissions: {
          email: true,
          fileShare: true,
          vpn: false,
          adminPanel: false,
          hrSystem: false
        }
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Create User Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.personalDetails?.fullName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                {userRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: {
                          ...formData.permissions,
                          [key]: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Account Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and access permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Account
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-gray-600 text-sm">Active Accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{inactiveCount}</p>
              <p className="text-gray-600 text-sm">Inactive Accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{suspendedCount}</p>
              <p className="text-gray-600 text-sm">Suspended</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {accountStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {userRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No user accounts found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{account.employeeName}</div>
                          <div className="text-sm text-gray-500">@{account.username}</div>
                          <div className="text-sm text-gray-500">{account.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(account.role)} mb-1`}>
                        {account.role}
                      </span>
                      <div className="text-sm text-gray-500">{account.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                      {account.failedLoginAttempts > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {account.failedLoginAttempts} failed attempts
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.lastLogin ? formatDate(account.lastLogin) : 'Never'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pwd: {formatDate(account.passwordLastChanged)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <select
                          value={account.status}
                          onChange={(e) => handleStatusChange(account.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {accountStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handlePasswordReset(account.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddAccountModal />
    </div>
  );
};

export default UserAccountManagement;