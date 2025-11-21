import React, { useState, useEffect } from 'react';
import { Package, TrendingDown, Calculator, Plus, Search, Download, Edit, Trash2, DollarSign } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const AssetDepreciation = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const assetsData = getFromStorage('financeAssets') || [];
    setAssets(assetsData);

    // Generate sample data if none exists
    if (assetsData.length === 0) {
      generateSampleAssets();
    }
  };

  const generateSampleAssets = () => {
    const sampleAssets = [
      {
        id: 'AST001',
        name: 'Dell Laptop - Inspiron 15',
        category: 'IT Equipment',
        purchaseDate: '2023-01-15',
        purchasePrice: 65000,
        currentValue: 52000,
        depreciationMethod: 'Straight Line',
        depreciationRate: 20,
        usefulLife: 5,
        location: 'IT Department',
        condition: 'Good',
        assignedTo: 'John Doe',
        status: 'Active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'AST002',
        name: 'Office Desk - Executive',
        category: 'Furniture',
        purchaseDate: '2022-06-20',
        purchasePrice: 25000,
        currentValue: 18750,
        depreciationMethod: 'Straight Line',
        depreciationRate: 10,
        usefulLife: 10,
        location: 'CEO Office',
        condition: 'Excellent',
        assignedTo: 'Jane Smith',
        status: 'Active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'AST003',
        name: 'HP Printer - LaserJet Pro',
        category: 'IT Equipment',
        purchaseDate: '2023-03-10',
        purchasePrice: 15000,
        currentValue: 12750,
        depreciationMethod: 'Straight Line',
        depreciationRate: 15,
        usefulLife: 7,
        location: 'Admin Office',
        condition: 'Good',
        assignedTo: 'Admin Team',
        status: 'Active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'AST004',
        name: 'Conference Table',
        category: 'Furniture',
        purchaseDate: '2021-11-05',
        purchasePrice: 35000,
        currentValue: 24500,
        depreciationMethod: 'Straight Line',
        depreciationRate: 10,
        usefulLife: 10,
        location: 'Conference Room',
        condition: 'Good',
        assignedTo: 'Meeting Room',
        status: 'Active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'AST005',
        name: 'Air Conditioner - 1.5 Ton',
        category: 'Electronics',
        purchaseDate: '2022-04-12',
        purchasePrice: 40000,
        currentValue: 28000,
        depreciationMethod: 'Straight Line',
        depreciationRate: 15,
        usefulLife: 8,
        location: 'Reception Area',
        condition: 'Good',
        assignedTo: 'Facilities',
        status: 'Active',
        createdAt: new Date().toISOString()
      }
    ];

    setAssets(sampleAssets);
    saveToStorage('financeAssets', sampleAssets);
  };

  const categories = ['IT Equipment', 'Furniture', 'Electronics', 'Machinery', 'Vehicles', 'Others'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const depreciationMethods = ['Straight Line', 'Reducing Balance', 'Double Declining'];

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = assets.reduce((sum, asset) => sum + (asset.purchasePrice - asset.currentValue), 0);
  const averageAssetValue = assets.length > 0 ? totalAssetValue / assets.length : 0;

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || asset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateDepreciation = (purchasePrice, purchaseDate, depreciationRate) => {
    const today = new Date();
    const purchase = new Date(purchaseDate);
    const yearsElapsed = (today - purchase) / (1000 * 60 * 60 * 24 * 365);
    return Math.min(purchasePrice * (depreciationRate / 100) * yearsElapsed, purchasePrice);
  };

  const AssetModal = ({ asset, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: asset?.name || '',
      category: asset?.category || '',
      purchaseDate: asset?.purchaseDate || '',
      purchasePrice: asset?.purchasePrice || '',
      depreciationMethod: asset?.depreciationMethod || 'Straight Line',
      depreciationRate: asset?.depreciationRate || '',
      usefulLife: asset?.usefulLife || '',
      location: asset?.location || '',
      condition: asset?.condition || 'Good',
      assignedTo: asset?.assignedTo || '',
      status: asset?.status || 'Active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const depreciation = calculateDepreciation(
        parseFloat(formData.purchasePrice),
        formData.purchaseDate,
        parseFloat(formData.depreciationRate)
      );
      
      const assetData = {
        ...formData,
        id: asset?.id || `AST${Date.now()}`,
        purchasePrice: parseFloat(formData.purchasePrice),
        currentValue: parseFloat(formData.purchasePrice) - depreciation,
        depreciationRate: parseFloat(formData.depreciationRate),
        usefulLife: parseInt(formData.usefulLife),
        createdAt: asset?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(assetData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h3>
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
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
              <select
                value={formData.depreciationMethod}
                onChange={(e) => setFormData({...formData, depreciationMethod: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {depreciationMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Depreciation Rate (%)"
                value={formData.depreciationRate}
                onChange={(e) => setFormData({...formData, depreciationRate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Useful Life (years)"
                value={formData.usefulLife}
                onChange={(e) => setFormData({...formData, usefulLife: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
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
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                {asset ? 'Update Asset' : 'Add Asset'}
              </button>
              <button
                type="button"
                onClick={onClose}
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

  const handleSaveAsset = (assetData) => {
    let updatedAssets;
    if (editingAsset) {
      updatedAssets = assets.map(asset => 
        asset.id === editingAsset.id ? assetData : asset
      );
    } else {
      updatedAssets = [...assets, assetData];
    }
    
    setAssets(updatedAssets);
    saveToStorage('financeAssets', updatedAssets);
    setShowAddModal(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const updatedAssets = assets.filter(asset => asset.id !== assetId);
      setAssets(updatedAssets);
      saveToStorage('financeAssets', updatedAssets);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset & Depreciation</h1>
          <p className="text-gray-600 mt-1">Manage company assets and track depreciation</p>
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
              <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
              <p className="text-gray-600 text-sm">Total Assets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAssetValue)}</p>
              <p className="text-gray-600 text-sm">Current Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDepreciation)}</p>
              <p className="text-gray-600 text-sm">Depreciation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageAssetValue)}</p>
              <p className="text-gray-600 text-sm">Average Value</p>
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Assets Overview</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depreciation
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
                    <p className="text-sm">Add your first asset to get started</p>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.id} • {asset.category}</div>
                        <div className="text-sm text-gray-500">{asset.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</div>
                      <div className="text-sm text-gray-500">{formatDate(asset.purchaseDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(asset.currentValue)}</div>
                      <div className="text-sm text-gray-500">{asset.condition}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.depreciationRate}%</div>
                      <div className="text-sm text-gray-500">{asset.depreciationMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setShowAddModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Asset Modal */}
      {showAddModal && (
        <AssetModal
          asset={editingAsset}
          onClose={() => {
            setShowAddModal(false);
            setEditingAsset(null);
          }}
          onSave={handleSaveAsset}
        />  
      )}
    </div>
  );
};

export default AssetDepreciation;