import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Edit, Trash2, Eye, X, Users } from 'lucide-react';
import { DesignationsAPI } from '../../api/designations';

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null });

  const designationsPerPage = 10;

  useEffect(() => {
    loadDesignations();
  }, []);

  const loadDesignations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DesignationsAPI.getAll();
      
      if (response.success) {
        setDesignations(response.result || []);
      } else {
        setError('Failed to load designations');
      }
    } catch (err) {
      console.error('Error loading designations:', err);
      setError('Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  const filteredDesignations = designations.filter(designation => {
    const matchesSearch = !searchTerm || 
      designation.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredDesignations.length / designationsPerPage);
  const startIndex = (currentPage - 1) * designationsPerPage;
  const currentDesignations = filteredDesignations.slice(startIndex, startIndex + designationsPerPage);

  const handleViewDesignation = async (designation) => {
    try {
      const response = await DesignationsAPI.getById(designation.id);
      if (response.success) {
        setSelectedDesignation(response.result);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error('Error fetching designation details:', err);
      setAlertModal({ show: true, message: 'Failed to load designation details', type: 'error' });
    }
  };

  const handleEditDesignation = async (designation) => {
    try {
      const response = await DesignationsAPI.getById(designation.id);
      if (response.success) {
        setSelectedDesignation(response.result);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Error fetching designation details:', err);
      setAlertModal({ show: true, message: 'Failed to load designation details', type: 'error' });
    }
  };

  const handleDeleteDesignation = async (designationId) => {
    setConfirmModal({
      show: true,
      onConfirm: async () => {
        try {
          const response = await DesignationsAPI.delete(designationId);
          if (response.success) {
            setAlertModal({ show: true, message: 'Designation deleted successfully', type: 'success' });
            loadDesignations();
          } else {
            setAlertModal({ show: true, message: 'Failed to delete designation', type: 'error' });
          }
        } catch (err) {
          console.error('Error deleting designation:', err);
          setAlertModal({ show: true, message: 'Failed to delete designation', type: 'error' });
        }
      }
    });
  };

  const AddDesignationModal = () => {
    const [formData, setFormData] = useState({
      name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const response = await DesignationsAPI.add({ name: formData.name });
        
        if (response.success) {
          setAlertModal({ show: true, message: 'Designation added successfully', type: 'success' });
          loadDesignations();
          setShowAddModal(false);
          setFormData({ name: '' });
        } else {
          setAlertModal({ show: true, message: response.message || 'Failed to add designation', type: 'error' });
        }
      } catch (err) {
        console.error('Error adding designation:', err);
        setAlertModal({ show: true, message: 'Failed to add designation', type: 'error' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Designation</h3>
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
              placeholder="Designation Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                {submitting ? 'Adding...' : 'Add Designation'}
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

  const EditDesignationModal = () => {
    const [formData, setFormData] = useState(selectedDesignation || {});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedDesignation) {
        setFormData(selectedDesignation);
      }
    }, [selectedDesignation]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const response = await DesignationsAPI.update({
          id: formData.id,
          name: formData.name
        });
        
        if (response.success) {
          setAlertModal({ show: true, message: 'Designation updated successfully', type: 'success' });
          loadDesignations();
          setShowEditModal(false);
          setSelectedDesignation(null);
        } else {
          setAlertModal({ show: true, message: response.message || 'Failed to update designation', type: 'error' });
        }
      } catch (err) {
        console.error('Error updating designation:', err);
        setAlertModal({ show: true, message: 'Failed to update designation', type: 'error' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Designation</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setSelectedDesignation(null);
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
              placeholder="Designation Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                {submitting ? 'Updating...' : 'Update Designation'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDesignation(null);
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

  const DesignationDetailsModal = () => {
    if (!showDetailsModal || !selectedDesignation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Designation Details</h3>
            <button 
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedDesignation(null);
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
                  <h2 className="text-2xl font-bold">{selectedDesignation.name}</h2>
                </div>
                <Briefcase className="w-12 h-12 text-orange-200" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditDesignation(selectedDesignation);
                }}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Edit Designation
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDesignation(null);
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
          <p className="text-gray-700 mb-6">Are you sure you want to delete this designation?</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Designation Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's designations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Designation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{designations.length}</p>
              <p className="text-gray-600 text-sm">Total Designations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredDesignations.length}</p>
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
            placeholder="Search designations..."
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
          <p className="text-gray-600 mt-4">Loading designations...</p>
        </div>
      ) : (
        /* Designations Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDesignations.length > 0 ? (
                  currentDesignations.map((designation, index) => (
                    <tr key={designation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{designation.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleViewDesignation(designation)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Designation"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditDesignation(designation)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Designation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDesignation(designation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Designation"
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
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No designations found</p>
                      <p className="text-sm">Add your first designation to get started</p>
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
                Showing {startIndex + 1} to {Math.min(startIndex + designationsPerPage, filteredDesignations.length)} of {filteredDesignations.length} designations
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
      <AddDesignationModal />
      <EditDesignationModal />
      <DesignationDetailsModal />
      <AlertModal />
      <ConfirmModal />
    </div>
  );
};

export default DesignationManagement;




















// import React, { useState, useEffect } from 'react';
// import { Briefcase, Plus, Search, Edit, Trash2, Eye, X, Users } from 'lucide-react';
// // import { DesignationsAPI } from '../../services/api/designations';
// import { DesignationsAPI } from '../../api/designations';
// const DesignationManagement = () => {
//   const [designations, setDesignations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedDesignation, setSelectedDesignation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const designationsPerPage = 10;

//   useEffect(() => {
//     loadDesignations();
//   }, []);

//   const loadDesignations = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await DesignationsAPI.getAll();
      
//       if (response.success) {
//         setDesignations(response.result || []);
//       } else {
//         setError('Failed to load designations');
//       }
//     } catch (err) {
//       console.error('Error loading designations:', err);
//       setError('Failed to load designations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDesignations = designations.filter(designation => {
//     const matchesSearch = !searchTerm || 
//       designation.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     return matchesSearch;
//   });

//   const totalPages = Math.ceil(filteredDesignations.length / designationsPerPage);
//   const startIndex = (currentPage - 1) * designationsPerPage;
//   const currentDesignations = filteredDesignations.slice(startIndex, startIndex + designationsPerPage);

//   const handleViewDesignation = async (designation) => {
//     try {
//       const response = await DesignationsAPI.getById(designation.id);
//       if (response.success) {
//         setSelectedDesignation(response.result);
//         setShowDetailsModal(true);
//       }
//     } catch (err) {
//       console.error('Error fetching designation details:', err);
//       alert('Failed to load designation details');
//     }
//   };

//   const handleEditDesignation = async (designation) => {
//     try {
//       const response = await DesignationsAPI.getById(designation.id);
//       if (response.success) {
//         setSelectedDesignation(response.result);
//         setShowEditModal(true);
//       }
//     } catch (err) {
//       console.error('Error fetching designation details:', err);
//       alert('Failed to load designation details');
//     }
//   };

//   const handleDeleteDesignation = async (designationId) => {
//     if (window.confirm('Are you sure you want to delete this designation?')) {
//       try {
//         const response = await DesignationsAPI.delete(designationId);
//         if (response.success) {
//           alert('Designation deleted successfully');
//           loadDesignations();
//         } else {
//           alert('Failed to delete designation');
//         }
//       } catch (err) {
//         console.error('Error deleting designation:', err);
//         alert('Failed to delete designation');
//       }
//     }
//   };

//   const AddDesignationModal = () => {
//     const [formData, setFormData] = useState({
//       name: ''
//     });
//     const [submitting, setSubmitting] = useState(false);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setSubmitting(true);
      
//       try {
//         const response = await DesignationsAPI.add({ name: formData.name });
        
//         if (response.success) {
//           alert('Designation added successfully');
//           loadDesignations();
//           setShowAddModal(false);
//           setFormData({ name: '' });
//         } else {
//           alert(response.message || 'Failed to add designation');
//         }
//       } catch (err) {
//         console.error('Error adding designation:', err);
//         alert('Failed to add designation');
//       } finally {
//         setSubmitting(false);
//       }
//     };

//     if (!showAddModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Add New Designation</h3>
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
//               placeholder="Designation Name"
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
//                 {submitting ? 'Adding...' : 'Add Designation'}
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

//   const EditDesignationModal = () => {
//     const [formData, setFormData] = useState(selectedDesignation || {});
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//       if (selectedDesignation) {
//         setFormData(selectedDesignation);
//       }
//     }, [selectedDesignation]);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setSubmitting(true);
      
//       try {
//         const response = await DesignationsAPI.update({
//           id: formData.id,
//           name: formData.name
//         });
        
//         if (response.success) {
//           alert('Designation updated successfully');
//           loadDesignations();
//           setShowEditModal(false);
//           setSelectedDesignation(null);
//         } else {
//           alert(response.message || 'Failed to update designation');
//         }
//       } catch (err) {
//         console.error('Error updating designation:', err);
//         alert('Failed to update designation');
//       } finally {
//         setSubmitting(false);
//       }
//     };

//     if (!showEditModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Edit Designation</h3>
//             <button 
//               onClick={() => {
//                 setShowEditModal(false);
//                 setSelectedDesignation(null);
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
//               placeholder="Designation Name"
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
//                 {submitting ? 'Updating...' : 'Update Designation'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setSelectedDesignation(null);
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

//   const DesignationDetailsModal = () => {
//     if (!showDetailsModal || !selectedDesignation) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold">Designation Details</h3>
//             <button 
//               onClick={() => {
//                 setShowDetailsModal(false);
//                 setSelectedDesignation(null);
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
//                   <h2 className="text-2xl font-bold">{selectedDesignation.name}</h2>
//                   {/* <p className="text-orange-100 mt-1">ID: {selectedDesignation.id}</p> */}
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex space-x-3 pt-4 border-t">
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   handleEditDesignation(selectedDesignation);
//                 }}
//                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
//               >
//                 Edit Designation
//               </button>
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   setSelectedDesignation(null);
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
//           <h1 className="text-2xl font-bold text-gray-900">Designation Management</h1>
//           <p className="text-gray-600 mt-1">Manage your organization's designations</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Designation
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
//               <Briefcase className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{designations.length}</p>
//               <p className="text-gray-600 text-sm">Total Designations</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <Briefcase className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{filteredDesignations.length}</p>
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
//             placeholder="Search designations..."
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
//           <p className="text-gray-600 mt-4">Loading designations...</p>
//         </div>
//       ) : (
//         /* Designations Table */
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     S.No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Designation Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentDesignations.length > 0 ? (
//                   currentDesignations.map((designation, index) => (
//                     <tr key={designation.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {/* {designation.id} */}
//                           {startIndex + index + 1}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{designation.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             onClick={() => handleViewDesignation(designation)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="View Designation"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleEditDesignation(designation)}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//                             title="Edit Designation"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteDesignation(designation.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete Designation"
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
//                       <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                       <p className="text-lg font-medium">No designations found</p>
//                       <p className="text-sm">Add your first designation to get started</p>
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
//                 Showing {startIndex + 1} to {Math.min(startIndex + designationsPerPage, filteredDesignations.length)} of {filteredDesignations.length} designations
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
//       <AddDesignationModal />
//       <EditDesignationModal />
//       <DesignationDetailsModal />
//     </div>
//   );
// };

// export default DesignationManagement;