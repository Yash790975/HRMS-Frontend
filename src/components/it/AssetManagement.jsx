import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, User, Calendar, MapPin, Monitor, Smartphone, Laptop } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const assetTypes = ['Laptop', 'Desktop', 'Monitor', 'Mobile Phone', 'Tablet', 'Printer', 'Router', 'Switch', 'Server', 'Other'];
  const assetStatuses = ['Available', 'Assigned', 'Under Maintenance', 'Retired'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const assetsData = getFromStorage('itAssets') || [];
    
    setEmployees(employeesData);
    setAssets(assetsData);

    // Generate sample assets data if none exists
    if (assetsData.length === 0) {
      generateSampleAssets(employeesData);
    }
  };

  const generateSampleAssets = (employeesData) => {
    const sampleAssets = [
      {
        id: 'AST001',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        serialNumber: 'MBP2024001',
        model: 'MacBook Pro M3',
        manufacturer: 'Apple',
        purchaseDate: '2024-01-15',
        purchasePrice: 250000,
        warrantyExpiry: '2027-01-15',
        status: 'Assigned',
        assignedTo: employeesData[0]?.id,
        assignedToName: employeesData[0]?.personalDetails?.fullName,
        assignedDate: '2024-01-20',
        location: 'Mumbai Office',
        condition: 'Excellent',
        specifications: '16GB RAM, 512GB SSD, M3 Chip'
      },
      {
        id: 'AST002',
        name: 'Dell Monitor 27"',
        type: 'Monitor',
        serialNumber: 'DM2024002',
        model: 'Dell UltraSharp U2723QE',
        manufacturer: 'Dell',
        purchaseDate: '2024-01-10',
        purchasePrice: 45000,
        warrantyExpiry: '2027-01-10',
        status: 'Available',
        assignedTo: null,
        assignedToName: null,
        assignedDate: null,
        location: 'IT Storage',
        condition: 'New',
        specifications: '4K, USB-C, Height Adjustable'
      },
      {
        id: 'AST003',
        name: 'iPhone 15 Pro',
        type: 'Mobile Phone',
        serialNumber: 'IP2024003',
        model: 'iPhone 15 Pro 256GB',
        manufacturer: 'Apple',
        purchaseDate: '2024-02-01',
        purchasePrice: 135000,
        warrantyExpiry: '2025-02-01',
        status: 'Assigned',
        assignedTo: employeesData[1]?.id,
        assignedToName: employeesData[1]?.personalDetails?.fullName,
        assignedDate: '2024-02-05',
        location: 'Delhi Office',
        condition: 'Good',
        specifications: '256GB, Pro Camera System, Titanium'
      },
      {
        id: 'AST004',
        name: 'HP Printer LaserJet',
        type: 'Printer',
        serialNumber: 'HP2024004',
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        purchaseDate: '2023-12-15',
        purchasePrice: 25000,
        warrantyExpiry: '2025-12-15',
        status: 'Under Maintenance',
        assignedTo: null,
        assignedToName: null,
        assignedDate: null,
        location: 'Bangalore Office',
        condition: 'Fair',
        specifications: 'Duplex Printing, Network Ready'
      },
      {
        id: 'AST005',
        name: 'Cisco Router',
        type: 'Router',
        serialNumber: 'CR2024005',
        model: 'Cisco ISR 4331',
        manufacturer: 'Cisco',
        purchaseDate: '2023-11-01',
        purchasePrice: 180000,
        warrantyExpiry: '2026-11-01',
        status: 'Available',
        assignedTo: null,
        assignedToName: null,
        assignedDate: null,
        location: 'Network Room',
        condition: 'Excellent',
        specifications: '4-port Gigabit, Security Bundle'
      }
    ];

    setAssets(sampleAssets);
    saveToStorage('itAssets', sampleAssets);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    const matchesType = !filterType || asset.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const availableCount = assets.filter(asset => asset.status === 'Available').length;
  const assignedCount = assets.filter(asset => asset.status === 'Assigned').length;
  const maintenanceCount = assets.filter(asset => asset.status === 'Under Maintenance').length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Available': 'bg-emerald-100 text-emerald-800',
      'Assigned': 'bg-blue-100 text-blue-800',
      'Under Maintenance': 'bg-amber-100 text-amber-800',
      'Retired': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Mobile Phone': return <Smartphone className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const handleAssignAsset = (assetId, employeeId) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    const updatedAssets = assets.map(asset =>
      asset.id === assetId
        ? { 
            ...asset, 
            status: 'Assigned', 
            assignedTo: employeeId,
            assignedToName: selectedEmployee?.personalDetails?.fullName,
            assignedDate: new Date().toISOString().split('T')[0]
          }
        : asset
    );
    setAssets(updatedAssets);
    saveToStorage('itAssets', updatedAssets);
  };

  const handleUnassignAsset = (assetId) => {
    const updatedAssets = assets.map(asset =>
      asset.id === assetId
        ? { 
            ...asset, 
            status: 'Available', 
            assignedTo: null,
            assignedToName: null,
            assignedDate: null
          }
        : asset
    );
    setAssets(updatedAssets);
    saveToStorage('itAssets', updatedAssets);
  };

  const AddAssetModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      serialNumber: '',
      model: '',
      manufacturer: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyExpiry: '',
      location: '',
      condition: 'New',
      specifications: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      const newAsset = {
        id: `AST${Date.now()}`,
        name: formData.name,
        type: formData.type,
        serialNumber: formData.serialNumber,
        model: formData.model,
        manufacturer: formData.manufacturer,
        purchaseDate: formData.purchaseDate,
        purchasePrice: parseFloat(formData.purchasePrice),
        warrantyExpiry: formData.warrantyExpiry,
        status: 'Available',
        assignedTo: null,
        assignedToName: null,
        assignedDate: null,
        location: formData.location,
        condition: formData.condition,
        specifications: formData.specifications
      };

      const updatedAssets = [...assets, newAsset];
      setAssets(updatedAssets);
      saveToStorage('itAssets', updatedAssets);
      setShowAddModal(false);
      setFormData({
        name: '',
        type: '',
        serialNumber: '',
        model: '',
        manufacturer: '',
        purchaseDate: '',
        purchasePrice: '',
        warrantyExpiry: '',
        location: '',
        condition: 'New',
        specifications: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Serial Number"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                placeholder="Purchase Date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Purchase Price"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                placeholder="Warranty Expiry"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <textarea
              placeholder="Specifications"
              value={formData.specifications}
              onChange={(e) => setFormData({...formData, specifications: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add Asset
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
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">Track and manage IT assets and allocations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              <p className="text-gray-600 text-sm">Available Assets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{assignedCount}</p>
              <p className="text-gray-600 text-sm">Assigned Assets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{maintenanceCount}</p>
              <p className="text-gray-600 text-sm">Under Maintenance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              <p className="text-gray-600 text-sm">Total Value</p>
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {assetStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">IT Assets</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No assets found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 text-orange-600">
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">S/N: {asset.serialNumber}</div>
                          <div className="text-sm text-gray-500">
                            Purchased: {formatDate(asset.purchaseDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.type}</div>
                      <div className="text-sm text-gray-500">{asset.model}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(asset.purchasePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.assignedToName ? (
                        <div>
                          <div className="text-sm text-gray-900">{asset.assignedToName}</div>
                          <div className="text-sm text-gray-500">
                            Since: {formatDate(asset.assignedDate)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {asset.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        Condition: {asset.condition}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.status === 'Available' ? (
                        <select
                          onChange={(e) => e.target.value && handleAssignAsset(asset.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="">Assign to...</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.personalDetails?.fullName}
                            </option>
                          ))}
                        </select>
                      ) : asset.status === 'Assigned' ? (
                        <button
                          onClick={() => handleUnassignAsset(asset.id)}
                          className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-lg hover:bg-red-200"
                        >
                          Unassign
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddAssetModal />
    </div>
  );
};

export default AssetManagement;