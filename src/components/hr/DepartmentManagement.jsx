import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Eye, X, Users, Calendar } from 'lucide-react';
import { DepartmentsAPI } from '../../api/departments';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null });
  
  const departmentsPerPage = 10;

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DepartmentsAPI.getAll();
      
      if (response.success) {
        setDepartments(response.result || []);
      } else {
        setError('Failed to load departments');
      }
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = !searchTerm || 
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);
  const startIndex = (currentPage - 1) * departmentsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, startIndex + departmentsPerPage);

  const handleViewDepartment = async (dept) => {
    try {
      const response = await DepartmentsAPI.getById(dept.id);
      if (response.success) {
        setSelectedDepartment(response.result);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error('Error fetching department details:', err);
      setAlertModal({ show: true, message: 'Failed to load department details', type: 'error' });
    }
  };

  const handleEditDepartment = async (dept) => {
    try {
      const response = await DepartmentsAPI.getById(dept.id);
      if (response.success) {
        setSelectedDepartment(response.result);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Error fetching department details:', err);
      setAlertModal({ show: true, message: 'Failed to load department details', type: 'error' });
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    setConfirmModal({
      show: true,
      onConfirm: async () => {
        try {
          const response = await DepartmentsAPI.delete(deptId);
          if (response.success) {
            setAlertModal({ show: true, message: 'Department deleted successfully', type: 'success' });
            loadDepartments();
          } else {
            setAlertModal({ show: true, message: 'Failed to delete department', type: 'error' });
          }
        } catch (err) {
          console.error('Error deleting department:', err);
          setAlertModal({ show: true, message: 'Failed to delete department', type: 'error' });
        }
      }
    });
  };

  const AddDepartmentModal = () => {
    const [formData, setFormData] = useState({
      name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!formData.name) return;
      
      setSubmitting(true);
      
      try {
        const response = await DepartmentsAPI.add({ name: formData.name });
        
        if (response.success) {
          setAlertModal({ show: true, message: 'Department added successfully', type: 'success' });
          loadDepartments();
          setShowAddModal(false);
          setFormData({ name: '' });
        } else {
          setAlertModal({ show: true, message: response.message || 'Failed to add department', type: 'error' });
        }
      } catch (err) {
        console.error('Error adding department:', err);
        setAlertModal({ show: true, message: 'Failed to add department', type: 'error' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Department</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Department Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={submitting}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Department'}
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
          </div>
        </div>
      </div>
    );
  };

  const EditDepartmentModal = () => {
    const [formData, setFormData] = useState(selectedDepartment || {});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedDepartment) {
        setFormData(selectedDepartment);
      }
    }, [selectedDepartment]);

    const handleSubmit = async () => {
      if (!formData.name) return;
      
      setSubmitting(true);
      
      try {
        const response = await DepartmentsAPI.update({
          id: formData.id,
          name: formData.name
        });
        
        if (response.success) {
          setAlertModal({ show: true, message: 'Department updated successfully', type: 'success' });
          loadDepartments();
          setShowEditModal(false);
          setSelectedDepartment(null);
        } else {
          setAlertModal({ show: true, message: response.message || 'Failed to update department', type: 'error' });
        }
      } catch (err) {
        console.error('Error updating department:', err);
        setAlertModal({ show: true, message: 'Failed to update department', type: 'error' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Department</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setSelectedDepartment(null);
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Department Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={submitting}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Department'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDepartment(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DepartmentDetailsModal = () => {
    if (!showDetailsModal || !selectedDepartment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Department Details</h3>
            <button 
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedDepartment(null);
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
                  <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditDepartment(selectedDepartment);
                }}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Edit Department
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDepartment(null);
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
          <p className="text-gray-700 mb-6">Are you sure you want to delete this department?</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's departments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-gray-600 text-sm">Total Departments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredDepartments.length}</p>
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
            placeholder="Search departments..."
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
          <p className="text-gray-600 mt-4">Loading departments...</p>
        </div>
      ) : (
        /* Departments Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDepartments.length > 0 ? (
                  currentDepartments.map((dept, index) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleViewDepartment(dept)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Department"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditDepartment(dept)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Department"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDepartment(dept.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Department"
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
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No departments found</p>
                      <p className="text-sm">Add your first department to get started</p>
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
                Showing {startIndex + 1} to {Math.min(startIndex + departmentsPerPage, filteredDepartments.length)} of {filteredDepartments.length} departments
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
      <AddDepartmentModal />
      <EditDepartmentModal />
      <DepartmentDetailsModal />
      <AlertModal />
      <ConfirmModal />
    </div>
  );
};

export default DepartmentManagement;















// import React, { useState, useEffect } from 'react';
// import { Building2, Plus, Search, Edit, Trash2, Eye, X, Users, Calendar } from 'lucide-react';
// // import { DepartmentsAPI } from '../../services/api/departments';

// import { DepartmentsAPI } from '../../api/departments';
// const DepartmentManagement = () => {
//   const [departments, setDepartments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const departmentsPerPage = 10;

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   const loadDepartments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await DepartmentsAPI.getAll();
      
//       if (response.success) {
//         setDepartments(response.result || []);
//       } else {
//         setError('Failed to load departments');
//       }
//     } catch (err) {
//       console.error('Error loading departments:', err);
//       setError('Failed to load departments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDepartments = departments.filter(dept => {
//     const matchesSearch = !searchTerm || 
//       dept.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     return matchesSearch;
//   });

//   const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);
//   const startIndex = (currentPage - 1) * departmentsPerPage;
//   const currentDepartments = filteredDepartments.slice(startIndex, startIndex + departmentsPerPage);

//   const handleViewDepartment = async (dept) => {
//     try {
//       const response = await DepartmentsAPI.getById(dept.id);
//       if (response.success) {
//         setSelectedDepartment(response.result);
//         setShowDetailsModal(true);
//       }
//     } catch (err) {
//       console.error('Error fetching department details:', err);
//       alert('Failed to load department details');
//     }
//   };

//   const handleEditDepartment = async (dept) => {
//     try {
//       const response = await DepartmentsAPI.getById(dept.id);
//       if (response.success) {
//         setSelectedDepartment(response.result);
//         setShowEditModal(true);
//       }
//     } catch (err) {
//       console.error('Error fetching department details:', err);
//       alert('Failed to load department details');
//     }
//   };

//   const handleDeleteDepartment = async (deptId) => {
//     if (window.confirm('Are you sure you want to delete this department?')) {
//       try {
//         const response = await DepartmentsAPI.delete(deptId);
//         if (response.success) {
//           alert('Department deleted successfully');
//           loadDepartments();
//         } else {
//           alert('Failed to delete department');
//         }
//       } catch (err) {
//         console.error('Error deleting department:', err);
//         alert('Failed to delete department');
//       }
//     }
//   };

//   const AddDepartmentModal = () => {
//     const [formData, setFormData] = useState({
//       name: ''
//     });
//     const [submitting, setSubmitting] = useState(false);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setSubmitting(true);
      
//       try {
//         const response = await DepartmentsAPI.add({ name: formData.name });
        
//         if (response.success) {
//           alert('Department added successfully');
//           loadDepartments();
//           setShowAddModal(false);
//           setFormData({ name: '' });
//         } else {
//           alert(response.message || 'Failed to add department');
//         }
//       } catch (err) {
//         console.error('Error adding department:', err);
//         alert('Failed to add department');
//       } finally {
//         setSubmitting(false);
//       }
//     };

//     if (!showAddModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Add New Department</h3>
//             <button 
//               onClick={() => setShowAddModal(false)}
//               className="text-gray-400 hover:text-gray-600"
//               disabled={submitting}
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Department Name"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//               disabled={submitting}
//             />
//             <div className="flex space-x-3">
//               <button
//                 type="submit"
//                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Adding...' : 'Add Department'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowAddModal(false)}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const EditDepartmentModal = () => {
//     const [formData, setFormData] = useState(selectedDepartment || {});
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//       if (selectedDepartment) {
//         setFormData(selectedDepartment);
//       }
//     }, [selectedDepartment]);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setSubmitting(true);
      
//       try {
//         const response = await DepartmentsAPI.update({
//           id: formData.id,
//           name: formData.name
//         });
        
//         if (response.success) {
//           alert('Department updated successfully');
//           loadDepartments();
//           setShowEditModal(false);
//           setSelectedDepartment(null);
//         } else {
//           alert(response.message || 'Failed to update department');
//         }
//       } catch (err) {
//         console.error('Error updating department:', err);
//         alert('Failed to update department');
//       } finally {
//         setSubmitting(false);
//       }
//     };

//     if (!showEditModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Edit Department</h3>
//             <button 
//               onClick={() => {
//                 setShowEditModal(false);
//                 setSelectedDepartment(null);
//               }}
//               className="text-gray-400 hover:text-gray-600"
//               disabled={submitting}
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Department Name"
//               value={formData.name || ''}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//               disabled={submitting}
//             />
//             <div className="flex space-x-3">
//               <button
//                 type="submit"
//                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Updating...' : 'Update Department'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setSelectedDepartment(null);
//                 }}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const DepartmentDetailsModal = () => {
//     if (!showDetailsModal || !selectedDepartment) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold">Department Details</h3>
//             <button 
//               onClick={() => {
//                 setShowDetailsModal(false);
//                 setSelectedDepartment(null);
//               }}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
          
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
//                   {/* <p className="text-orange-100 mt-1">ID: {selectedDepartment.id}</p> */}
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex space-x-3 pt-4 border-t">
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   handleEditDepartment(selectedDepartment);
//                 }}
//                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
//               >
//                 Edit Department
//               </button>
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   setSelectedDepartment(null);
//                 }}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
//           <p className="text-gray-600 mt-1">Manage your organization's departments</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Department
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
//               <Building2 className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
//               <p className="text-gray-600 text-sm">Total Departments</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <Building2 className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{filteredDepartments.length}</p>
//               <p className="text-gray-600 text-sm">Filtered Results</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
//               <p className="text-gray-600 text-sm">Total Pages</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search departments..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
//           <p className="text-gray-600 mt-4">Loading departments...</p>
//         </div>
//       ) : (
//         /* Departments Table */
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     S.No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Department Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentDepartments.length > 0 ? (
//                   currentDepartments.map((dept, index) => (
//                     <tr key={dept.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {/* {dept.id} */}
//                           {startIndex + index + 1}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{dept.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             onClick={() => handleViewDepartment(dept)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="View Department"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleEditDepartment(dept)}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//                             title="Edit Department"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteDepartment(dept.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete Department"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
//                       <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                       <p className="text-lg font-medium">No departments found</p>
//                       <p className="text-sm">Add your first department to get started</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing {startIndex + 1} to {Math.min(startIndex + departmentsPerPage, filteredDepartments.length)} of {filteredDepartments.length} departments
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-3 py-1 bg-orange-600 text-white rounded-lg">
//                   {currentPage}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <AddDepartmentModal />
//       <EditDepartmentModal />
//       <DepartmentDetailsModal />
//     </div>
//   );
// };

// export default DepartmentManagement;
