import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Filter, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const MyAssets = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock assets data
  const [assets] = useState([
    {
      id: '1',
      title: 'MacBook Pro 16-inch',
      description: 'Development laptop assigned for software engineering work',
      value: 2500.00,
      category: 'laptop',
      assignedDate: '2024-01-15',
      status: 'assigned',
      requestDate: '2024-01-10',
      approvedDate: '2024-01-14',
      assetTag: 'LT-2024-001',
      serialNumber: 'MBP16-2024-0001',
      condition: 'excellent',
      returnDueDate: null
    },
    {
      id: '2',
      title: 'Office Security Card',
      description: 'Building access card for main office premises',
      value: 25.00,
      category: 'security-card',
      assignedDate: '2024-01-08',
      status: 'assigned',
      requestDate: '2024-01-05',
      approvedDate: '2024-01-07',
      assetTag: 'SC-2024-001',
      serialNumber: 'SEC-CARD-0001',
      condition: 'good',
      returnDueDate: null
    },
    {
      id: '3',
      title: 'Project Management Books Set',
      description: 'Collection of PMP certification study materials',
      value: 150.00,
      category: 'library-books',
      assignedDate: '2024-01-20',
      status: 'assigned',
      requestDate: '2024-01-18',
      approvedDate: '2024-01-19',
      assetTag: 'BK-2024-001',
      serialNumber: 'LIB-BOOKS-001',
      condition: 'good',
      returnDueDate: '2024-04-20'
    },
    {
      id: '4',
      title: 'Company Mobile Phone',
      description: 'iPhone 15 Pro with corporate plan and SIM card',
      value: 999.00,
      category: 'mobile-sim-card',
      assignedDate: null,
      status: 'pending',
      requestDate: '2024-01-25',
      approvedDate: null,
      assetTag: 'PH-2024-001',
      serialNumber: 'IP15-PRO-001',
      condition: 'new',
      returnDueDate: null
    },
    {
      id: '5',
      title: 'Wireless Mouse',
      description: 'Logitech MX Master 3 wireless mouse for laptop',
      value: 89.99,
      category: 'mouse',
      assignedDate: '2024-01-12',
      status: 'assigned',
      requestDate: '2024-01-10',
      approvedDate: '2024-01-11',
      assetTag: 'MS-2024-001',
      serialNumber: 'MX3-2024-001',
      condition: 'excellent',
      returnDueDate: null
    },
    {
      id: '6',
      title: 'Noise Cancelling Headphones',
      description: 'Sony WH-1000XM4 headphones for virtual meetings',
      value: 349.99,
      category: 'headphone',
      assignedDate: null,
      status: 'rejected',
      requestDate: '2024-01-22',
      rejectedDate: '2024-01-24',
      rejectionReason: 'Budget constraints for current quarter',
      assetTag: 'HP-2024-001',
      serialNumber: 'SONY-WH-001',
      condition: 'new'
    },
    {
      id: '7',
      title: 'Company Vehicle Usage',
      description: 'Monthly usage allowance for company vehicle fleet',
      value: 500.00,
      category: 'vehicle-transportation',
      assignedDate: '2024-01-01',
      status: 'assigned',
      requestDate: '2023-12-28',
      approvedDate: '2023-12-30',
      assetTag: 'VH-2024-001',
      serialNumber: 'FLEET-CAR-001',
      condition: 'good',
      returnDueDate: null
    },
    {
      id: '8',
      title: 'Office Drawer Keys',
      description: 'Set of keys for personal office drawer and cabinet',
      value: 15.00,
      category: 'drawer-keys',
      assignedDate: '2024-01-05',
      status: 'assigned',
      requestDate: '2024-01-03',
      approvedDate: '2024-01-04',
      assetTag: 'KEY-2024-001',
      serialNumber: 'DRAWER-KEY-001',
      condition: 'good',
      returnDueDate: null
    }
  ]);

  const filteredAssets = assets.filter(asset => {
    const statusMatch = filter === 'all' || asset.status === filter;
    
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const assetDate = new Date(asset.assignedDate || asset.requestDate);
      const today = new Date();
      
      switch (dateFilter) {
        case 'this-month':
          dateMatch = assetDate.getMonth() === today.getMonth() && 
                     assetDate.getFullYear() === today.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
          dateMatch = assetDate.getMonth() === lastMonth.getMonth() && 
                     assetDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this-year':
          dateMatch = assetDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return statusMatch && dateMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'returned':
        return <Package className="h-4 w-4 text-gray-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'laptop':
        return 'bg-blue-100 text-blue-800';
      case 'mobile-sim-card':
        return 'bg-purple-100 text-purple-800';
      case 'security-card':
        return 'bg-orange-100 text-orange-800';
      case 'library-books':
        return 'bg-green-100 text-green-800';
      case 'drawer-keys':
        return 'bg-yellow-100 text-yellow-800';
      case 'mouse':
        return 'bg-indigo-100 text-indigo-800';
      case 'headphone':
        return 'bg-pink-100 text-pink-800';
      case 'vehicle-transportation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'laptop': 'Laptop',
      'mobile-sim-card': 'Mobile & SIM',
      'security-card': 'Security Card',
      'library-books': 'Library Books',
      'drawer-keys': 'Drawer Keys',
      'mouse': 'Mouse',
      'headphone': 'Headphone',
      'vehicle-transportation': 'Vehicle/Transportation',
      'other': 'Other Asset'
    };
    return labels[category] || category;
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      case 'new':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalAssets = filteredAssets.length;
  const assignedAssets = filteredAssets.filter(a => a.status === 'assigned').length;
  const pendingAssets = filteredAssets.filter(a => a.status === 'pending').length;
  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0);

  const checkOverdueAssets = (asset) => {
    if (asset.returnDueDate && asset.status === 'assigned') {
      const dueDate = new Date(asset.returnDueDate);
      const today = new Date();
      return today > dueDate;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assets</h1>
          <p className="text-gray-600">Track and manage your assigned company assets</p>
        </div>
        <button
          onClick={() => navigate('/assets/request')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Request Asset</span>
        </button>
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{totalAssets}</p>
              <p className="text-xs text-gray-500">All requests</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-green-600">{assignedAssets}</p>
              <p className="text-xs text-gray-500">Active assets</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAssets}</p>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">${totalValue.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Asset worth</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {filteredAssets.map((asset) => {
          const isOverdue = checkOverdueAssets(asset);
          const displayStatus = isOverdue ? 'overdue' : asset.status;
          
          return (
            <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{asset.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(displayStatus)}`}>
                      {getStatusIcon(displayStatus)}
                      <span className="ml-1">{isOverdue ? 'Overdue Return' : asset.status}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(asset.category)}`}>
                      {getCategoryLabel(asset.category)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{asset.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Asset Tag:</span>
                      <span>{asset.assetTag}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Serial:</span>
                      <span>{asset.serialNumber}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Condition:</span>
                      <span className={`capitalize ${getConditionColor(asset.condition)}`}>
                        {asset.condition}
                      </span>
                    </div>
                    {asset.assignedDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Assigned: {new Date(asset.assignedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Requested: {new Date(asset.requestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900">{asset.value.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500">Asset Value</p>
                </div>
              </div>

              {/* Status Details */}
              {asset.status === 'assigned' && asset.approvedDate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>Assigned:</strong> {new Date(asset.approvedDate).toLocaleDateString()}
                    {asset.returnDueDate && (
                      <>
                        {' | '}
                        <strong>Return Due:</strong> {new Date(asset.returnDueDate).toLocaleDateString()}
                        {isOverdue && <span className="text-red-600 font-bold"> - OVERDUE!</span>}
                      </>
                    )}
                  </p>
                </div>
              )}

              {asset.status === 'rejected' && asset.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>Rejected:</strong> {new Date(asset.rejectedDate).toLocaleDateString()} | 
                    <strong> Reason:</strong> {asset.rejectionReason}
                  </p>
                </div>
              )}

              {asset.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Status:</strong> Pending approval - requested on {new Date(asset.requestDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>OVERDUE:</strong> This asset was due for return on {new Date(asset.returnDueDate).toLocaleDateString()}. 
                    Please contact IT department immediately.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  ID: {asset.id}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    View Details
                  </button>
                  {asset.status === 'assigned' && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Request Return
                    </button>
                  )}
                  {asset.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' && dateFilter === 'all'
              ? 'You haven\'t requested any assets yet.' 
              : 'No assets match the selected filters.'}
          </p>   
          <button
            onClick={() => navigate('/assets/request')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Request Your First Asset
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAssets;