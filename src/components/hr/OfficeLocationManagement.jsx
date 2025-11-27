import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Edit, Trash2, Eye, X, Building } from 'lucide-react';
import { OfficeLocationsAPI } from '../../api/officeLocations'

const OfficeLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null }); 
  const locationsPerPage = 10;

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await OfficeLocationsAPI.getAll();
      
      if (response.success) {
        setLocations(response.result || []);
      } else {
        setError('Failed to load office locations');
      }
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load office locations');
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = !searchTerm || 
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);
  const startIndex = (currentPage - 1) * locationsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + locationsPerPage);

  const handleViewLocation = async (location) => {
    try {
      const response = await OfficeLocationsAPI.getById(location.id);
      if (response.success) {
        setSelectedLocation(response.result);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error('Error fetching location details:', err);
      // alert('Failed to load location details');
      setAlertModal({ show: true, message: 'Failed to load location details', type: 'error' });

    }
  };

  const handleEditLocation = async (location) => {
    try {
      const response = await OfficeLocationsAPI.getById(location.id);
      if (response.success) {
        setSelectedLocation(response.result);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Error fetching location details:', err);
      // alert('Failed to load location details');
      setAlertModal({ show: true, message: 'Failed to load location details', type: 'error' });
    }
  };

  // const handleDeleteLocation = async (locationId) => {
  //   if (window.confirm('Are you sure you want to delete this office location?')) {
  //     try {
  //       const response = await OfficeLocationsAPI.delete(locationId);
  //       if (response.success) {
  //         // alert('Office location deleted successfully');
  //         setAlertModal({ show: true, message: 'Office location deleted successfully', type: 'success' });
  
  //         loadLocations();
  //       } else {
  //         // alert('Failed to delete office location');
  //         setAlertModal({ show: true, message: 'Failed to delete office location', type: 'error' });
    
  //       }
  //     } catch (err) {
  //       console.error('Error deleting location:', err);
  //       // alert('Failed to delete office location');
  //       setAlertModal({ show: true, message: 'Failed to delete office location', type: 'error' });
    
  //     }
  //   }
  // };


  const handleDeleteLocation = async (locationId) => {
    setConfirmModal({
      show: true,
      onConfirm: async () => {
        try {
          const response = await OfficeLocationsAPI.delete(locationId);
          if (response.success) {
            setAlertModal({ show: true, message: 'Office location deleted successfully', type: 'success' });
            loadLocations();
          } else {
            setAlertModal({ show: true, message: 'Failed to delete office location', type: 'error' });
          }
        } catch (err) {
          console.error('Error deleting location:', err);
          setAlertModal({ show: true, message: 'Failed to delete office location', type: 'error' });
        }
      }
    });
  };
  const getCityCount = () => {
    const uniqueCities = new Set(locations.map(loc => loc.city));
    return uniqueCities.size;
  };

  const getStateCount = () => {
    const uniqueStates = new Set(locations.map(loc => loc.state));
    return uniqueStates.size;
  };

  const AddLocationModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      city: '',
      state: '',
      country: '',
      full_address: '',
      pincode: '',
      latitude: '',
      longitude: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const payload = {
          ...formData,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0
        };
        
        const response = await OfficeLocationsAPI.add(payload);
        
        if (response.success) {
          // alert('Office location added successfully');
           setAlertModal({ show: true, message: 'Office location added successfully', type: 'success' });
          loadLocations();
          setShowAddModal(false);
          setFormData({
            name: '',
            city: '',
            state: '',
            country: '',
            full_address: '',
            pincode: '',
            latitude: '',
            longitude: ''
          });
        } else {
          // alert(response.message || 'Failed to add office location');
          setAlertModal({ show: true, message: response.message || 'Failed to add office location', type: 'error' });
        }
      } catch (err) {
        console.error('Error adding location:', err);
        // alert('Failed to add office location');
            setAlertModal({ show: true, message: 'Failed to add office location', type: 'error' });
     
      } finally {
        setSubmitting(false);
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Office Location</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Country *"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
            </div>
            <textarea
              placeholder="Full Address *"
              value={formData.full_address}
              onChange={(e) => setFormData({...formData, full_address: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows="3"
              required
              disabled={submitting}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                placeholder="Latitude (optional)"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={submitting}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude (optional)"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={submitting}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Location'}
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

  const EditLocationModal = () => {
    const [formData, setFormData] = useState(selectedLocation || {});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedLocation) {
        setFormData(selectedLocation);
      }
    }, [selectedLocation]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        const payload = {
          ...formData,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0
        };
        
        const response = await OfficeLocationsAPI.update(payload);
        
        if (response.success) {
          // alert('Office location updated successfully');
           setAlertModal({ show: true, message: 'Office location updated successfully', type: 'success' });
     
          loadLocations();
          setShowEditModal(false);
          setSelectedLocation(null);
        } else {
          // alert(response.message || 'Failed to update office location');
          setAlertModal({ show: true, message: response.message || 'Failed to update office location', type: 'error' });
      
        }
      } catch (err) {
        console.error('Error updating location:', err);
        // alert('Failed to update office location');
        setAlertModal({ show: true, message: 'Failed to update office location', type: 'error' });
   
      } finally {
        setSubmitting(false);
      }
    };

    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Office Location</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setSelectedLocation(null);
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location Name *"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="City *"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state || ''}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Country *"
                value={formData.country || ''}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={formData.pincode || ''}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
                disabled={submitting}
              />
            </div>
            <textarea
              placeholder="Full Address *"
              value={formData.full_address || ''}
              onChange={(e) => setFormData({...formData, full_address: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows="3"
              required
              disabled={submitting}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={submitting}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={submitting}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Location'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedLocation(null);
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

  const LocationDetailsModal = () => {
    if (!showDetailsModal || !selectedLocation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Office Location Details</h3>
            <button 
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedLocation(null);
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
                  <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
                  <p className="text-orange-100 mt-1">ID: {selectedLocation.id}</p>
                </div>
                <MapPin className="w-12 h-12" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">City</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLocation.city}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">State</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLocation.state}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Country</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLocation.country}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pincode</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLocation.pincode}</p>
              </div>
            </div>

            {/* Full Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Full Address</p>
              <p className="text-gray-900">{selectedLocation.full_address}</p>
            </div>

            {/* Coordinates */}
            {(selectedLocation.latitude || selectedLocation.longitude) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Coordinates</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Latitude</p>
                    <p className="text-gray-900 font-medium">{selectedLocation.latitude}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Longitude</p>
                    <p className="text-gray-900 font-medium">{selectedLocation.longitude}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditLocation(selectedLocation);
                }}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Edit Location
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedLocation(null);
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
          <p className="text-gray-700 mb-6">Are you sure you want to delete this office location?</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Office Location Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's office locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
              <p className="text-gray-600 text-sm">Total Locations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{getCityCount()}</p>
              <p className="text-gray-600 text-sm">Cities</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{getStateCount()}</p>
              <p className="text-gray-600 text-sm">States</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredLocations.length}</p>
              <p className="text-gray-600 text-sm">Filtered Results</p>
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
            placeholder="Search locations by name, city, or state..."
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
          <p className="text-gray-600 mt-4">Loading office locations...</p>
        </div>
      ) : (
        /* Locations Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pincode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLocations.length > 0 ? (
                  currentLocations.map((location, index) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {/* {location.id} */}
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{location.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{location.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{location.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{location.pincode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewLocation(location)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Location"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditLocation(location)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Location"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLocation(location.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No office locations found</p>
                      <p className="text-sm">Add your first office location to get started</p>
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
                Showing {startIndex + 1} to {Math.min(startIndex + locationsPerPage, filteredLocations.length)} of {filteredLocations.length} locations
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
      <AddLocationModal />
      <EditLocationModal />
      <LocationDetailsModal />
      <AlertModal />
      <ConfirmModal />
    </div>
  );
};

export default OfficeLocationManagement;