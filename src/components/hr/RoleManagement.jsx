import React, { useState, useEffect } from 'react';
import { Shield, Plus, Search, Edit, Trash2, Eye, X, Users } from 'lucide-react';
import { RolesAPI } from '../../api/roles';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'success' }); 
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null }); 
 
  const rolesPerPage = 10;

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await RolesAPI.getAll();
      
      if (response.success) {
        setRoles(response.result || []);
      } else {
        setError('Failed to load roles');
      }
    } catch (err) {
      console.error('Error loading roles:', err);
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = !searchTerm || 
      role.role_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const startIndex = (currentPage - 1) * rolesPerPage;
  const currentRoles = filteredRoles.slice(startIndex, startIndex + rolesPerPage);

  const handleViewRole = async (role) => {
    try {
      const response = await RolesAPI.getById(role.role_id);
      if (response.success) {
        setSelectedRole(response.result);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error('Error fetching role details:', err);
      // alert('Failed to load role details');
      setAlertModal({ show: true, message: 'Failed to load role details', type: 'error' });
  
    }
  };

  const handleEditRole = async (role) => {
    try {
      const response = await RolesAPI.getById(role.role_id);
      if (response.success) {
        setSelectedRole(response.result);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Error fetching role details:', err);
      // alert('Failed to load role details');
      setAlertModal({ show: true, message: 'Failed to load role details', type: 'error' });
  
    }
  };

  // const handleDeleteRole = async (roleId) => {
  //   if (window.confirm('Are you sure you want to delete this role?')) {
  //     try {
  //       const response = await RolesAPI.delete(roleId);
  //       if (response.success) {
  //         alert('Role deleted successfully');
  //         loadRoles();
  //       } else {
  //         alert('Failed to delete role');
  //       }
  //     } catch (err) {
  //       console.error('Error deleting role:', err);
  //       alert('Failed to delete role');
  //     }
  //   }
  // };

  const handleDeleteRole = async (roleId) => {
    setConfirmModal({
      show: true,
      onConfirm: async () => {
        try {
          const response = await RolesAPI.delete(roleId);
          if (response.success) {
            setAlertModal({ show: true, message: 'Role deleted successfully', type: 'success' });
            loadRoles();
          } else {
            setAlertModal({ show: true, message: 'Failed to delete role', type: 'error' });
          }
        } catch (err) {
          console.error('Error deleting role:', err);
          setAlertModal({ show: true, message: 'Failed to delete role', type: 'error' });
        }
      }
    });
  };
  const AddRoleModal = () => {
    const [formData, setFormData] = useState({
      role_name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const response = await RolesAPI.add({ role_name: formData.role_name });
        
        if (response.success) {
          // alert('Role added successfully');
          setAlertModal({ show: true, message: 'Role added successfully', type: 'success' });

          loadRoles();
          setShowAddModal(false);
          setFormData({ role_name: '' });
        } else {
          // alert(response.message || 'Failed to add role');
          setAlertModal({ show: true, message: response.message || 'Failed to add role', type: 'error' });
   

        }
      } catch (err) {
        console.error('Error adding role:', err);
        // alert('Failed to add role');
        setAlertModal({ show: true, message: 'Failed to add role', type: 'error' });
  
      } finally {
        setSubmitting(false);
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Role</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Role Name"
              value={formData.role_name}
              onChange={(e) => setFormData({...formData, role_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={submitting}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Role'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditRoleModal = () => {
    const [formData, setFormData] = useState(selectedRole || {});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedRole) {
        setFormData(selectedRole);
      }
    }, [selectedRole]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const response = await RolesAPI.update({
          role_id: formData.role_id,
          role_name: formData.role_name
        });
        
        if (response.success) {
          // alert('Role updated successfully');
          setAlertModal({ show: true, message: 'Role updated successfully', type: 'success' });

          loadRoles();
          setShowEditModal(false);
          setSelectedRole(null);
        } else {
          // alert(response.message || 'Failed to update role');
          setAlertModal({ show: true, message: response.message || 'Failed to update role', type: 'error' });
        }
      } catch (err) {
        console.error('Error updating role:', err);
        // alert('Failed to update role');
        setAlertModal({ show: true, message: 'Failed to update role', type: 'error' });
    
      } finally {
        setSubmitting(false);
      }
    };

    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Role</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setSelectedRole(null);
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Role Name"
              value={formData.role_name || ''}
              onChange={(e) => setFormData({...formData, role_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={submitting}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Role'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRole(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RoleDetailsModal = () => {
    if (!showDetailsModal || !selectedRole) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Role Details</h3>
            <button 
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedRole(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRole.role_name}</h2>
                  <p className="text-orange-100 mt-1">Role ID: {selectedRole.role_id}</p>
                </div>
                <Shield className="w-12 h-12 text-orange-200" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditRole(selectedRole);
                }}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Edit Role
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRole(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlertModal = () => {
    if (!alertModal.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className={`text-lg font-semibold mb-3 ${alertModal.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {alertModal.type === 'success' ? '✓ Success' : '✗ Error'}
          </h3>
          <p className="text-gray-700 mb-4">{alertModal.message}</p>
          <button
            onClick={() => setAlertModal({ show: false, message: '', type: 'success' })}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  const ConfirmModal = () => {
    if (!confirmModal.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 text-orange-600">Confirm Delete</h3>
          <p className="text-gray-700 mb-6">Are you sure you want to delete this role?</p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal({ show: false, onConfirm: null });
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmModal({ show: false, onConfirm: null })}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage employee roles and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              <p className="text-gray-600 text-sm">Total Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredRoles.length}</p>
              <p className="text-gray-600 text-sm">Filtered Results</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
              <p className="text-gray-600 text-sm">Total Pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading roles...</p>
        </div>
      ) : (
        /* Roles Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRoles.length > 0 ? (
                  currentRoles.map((role, index) => (
                    <tr key={role.role_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm  text-gray-900">{role.role_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleViewRole(role)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Role"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditRole(role)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRole(role.role_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No roles found</p>
                      <p className="text-sm">Add your first role to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + rolesPerPage, filteredRoles.length)} of {filteredRoles.length} roles
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-orange-600 text-white rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddRoleModal />
      <EditRoleModal />
      <RoleDetailsModal />
      <AlertModal />
      <ConfirmModal />
    </div>
  );
};

export default RoleManagement;