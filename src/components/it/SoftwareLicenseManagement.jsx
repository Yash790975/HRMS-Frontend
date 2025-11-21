import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, Filter, Calendar, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const SoftwareLicenseManagement = () => {
  const [licenses, setLicenses] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const licenseStatuses = ['Active', 'Expired', 'Expiring Soon', 'Inactive'];
  const softwareCategories = ['Operating System', 'Office Suite', 'Development Tools', 'Design Software', 'Security', 'Database', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const licensesData = getFromStorage('softwareLicenses') || [];
    const installationsData = getFromStorage('softwareInstallations') || [];
    
    setEmployees(employeesData);
    setLicenses(licensesData);
    setInstallations(installationsData);

    // Generate sample data if none exists
    if (licensesData.length === 0) {
      generateSampleLicenses();
    }
    if (installationsData.length === 0 && employeesData.length > 0) {
      generateSampleInstallations(employeesData);
    }
  };

  const generateSampleLicenses = () => {
    const sampleLicenses = [
      {
        id: 'LIC001',
        softwareName: 'Microsoft Office 365',
        category: 'Office Suite',
        vendor: 'Microsoft',
        licenseType: 'Subscription',
        totalLicenses: 100,
        usedLicenses: 85,
        purchaseDate: '2024-01-01',
        expiryDate: '2025-01-01',
        cost: 500000,
        status: 'Active',
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
        supportContact: 'support@microsoft.com'
      },
      {
        id: 'LIC002',
        softwareName: 'Adobe Creative Suite',
        category: 'Design Software',
        vendor: 'Adobe',
        licenseType: 'Subscription',
        totalLicenses: 25,
        usedLicenses: 22,
        purchaseDate: '2024-02-01',
        expiryDate: '2025-02-01',
        cost: 750000,
        status: 'Active',
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
        supportContact: 'support@adobe.com'
      },
      {
        id: 'LIC003',
        softwareName: 'Windows 11 Pro',
        category: 'Operating System',
        vendor: 'Microsoft',
        licenseType: 'Perpetual',
        totalLicenses: 150,
        usedLicenses: 142,
        purchaseDate: '2023-06-01',
        expiryDate: null,
        cost: 300000,
        status: 'Active',
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
        supportContact: 'support@microsoft.com'
      },
      {
        id: 'LIC004',
        softwareName: 'Antivirus Enterprise',
        category: 'Security',
        vendor: 'Symantec',
        licenseType: 'Subscription',
        totalLicenses: 200,
        usedLicenses: 195,
        purchaseDate: '2023-12-01',
        expiryDate: '2024-12-01',
        cost: 400000,
        status: 'Expiring Soon',
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
        supportContact: 'support@symantec.com'
      },
      {
        id: 'LIC005',
        softwareName: 'Visual Studio Professional',
        category: 'Development Tools',
        vendor: 'Microsoft',
        licenseType: 'Subscription',
        totalLicenses: 15,
        usedLicenses: 12,
        purchaseDate: '2023-08-01',
        expiryDate: '2024-08-01',
        cost: 180000,
        status: 'Expired',
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
        supportContact: 'support@microsoft.com'
      }
    ];

    setLicenses(sampleLicenses);
    saveToStorage('softwareLicenses', sampleLicenses);
  };

  const generateSampleInstallations = (employeesData) => {
    const sampleInstallations = [
      {
        id: 'INST001',
        licenseId: 'LIC001',
        softwareName: 'Microsoft Office 365',
        employeeId: employeesData[0]?.id,
        employeeName: employeesData[0]?.personalDetails?.fullName,
        installDate: '2024-01-15',
        version: '2024',
        status: 'Installed',
        deviceInfo: 'Laptop - Windows 11'
      },
      {
        id: 'INST002',
        licenseId: 'LIC002',
        softwareName: 'Adobe Creative Suite',
        employeeId: employeesData[1]?.id,
        employeeName: employeesData[1]?.personalDetails?.fullName,
        installDate: '2024-02-10',
        version: '2024',
        status: 'Installed',
        deviceInfo: 'Desktop - macOS'
      },
      {
        id: 'INST003',
        licenseId: 'LIC003',
        softwareName: 'Windows 11 Pro',
        employeeId: employeesData[2]?.id,
        employeeName: employeesData[2]?.personalDetails?.fullName,
        installDate: '2024-01-20',
        version: '22H2',
        status: 'Installed',
        deviceInfo: 'Laptop - Dell Latitude'
      }
    ];

    setInstallations(sampleInstallations);
    saveToStorage('softwareInstallations', sampleInstallations);
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = !searchTerm || 
      license.softwareName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || license.status === filterStatus;
    const matchesCategory = !filterCategory || license.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeCount = licenses.filter(license => license.status === 'Active').length;
  const expiredCount = licenses.filter(license => license.status === 'Expired').length;
  const expiringSoonCount = licenses.filter(license => license.status === 'Expiring Soon').length;
  const totalCost = licenses.reduce((sum, license) => sum + license.cost, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-amber-100 text-amber-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const AddLicenseModal = () => {
    const [formData, setFormData] = useState({
      softwareName: '',
      category: '',
      vendor: '',
      licenseType: 'Subscription',
      totalLicenses: '',
      purchaseDate: '',
      expiryDate: '',
      cost: '',
      licenseKey: '',
      supportContact: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      const newLicense = {
        id: `LIC${String(licenses.length + 1).padStart(3, '0')}`,
        softwareName: formData.softwareName,
        category: formData.category,
        vendor: formData.vendor,
        licenseType: formData.licenseType,
        totalLicenses: parseInt(formData.totalLicenses),
        usedLicenses: 0,
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate || null,
        cost: parseFloat(formData.cost),
        status: 'Active',
        licenseKey: formData.licenseKey,
        supportContact: formData.supportContact
      };

      const updatedLicenses = [...licenses, newLicense];
      setLicenses(updatedLicenses);
      saveToStorage('softwareLicenses', updatedLicenses);
      setShowAddModal(false);
      setFormData({
        softwareName: '',
        category: '',
        vendor: '',
        licenseType: 'Subscription',
        totalLicenses: '',
        purchaseDate: '',
        expiryDate: '',
        cost: '',
        licenseKey: '',
        supportContact: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Software License</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Software Name"
                value={formData.softwareName}
                onChange={(e) => setFormData({...formData, softwareName: e.target.value})}
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
                {softwareCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.licenseType}
                onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="Subscription">Subscription</option>
                <option value="Perpetual">Perpetual</option>
                <option value="Volume">Volume</option>
              </select>
              <input
                type="number"
                placeholder="Total Licenses"
                value={formData.totalLicenses}
                onChange={(e) => setFormData({...formData, totalLicenses: e.target.value})}
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
                type="date"
                placeholder="Expiry Date (optional)"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Cost"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="License Key"
                value={formData.licenseKey}
                onChange={(e) => setFormData({...formData, licenseKey: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                placeholder="Support Contact"
                value={formData.supportContact}
                onChange={(e) => setFormData({...formData, supportContact: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add License
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
          <h1 className="text-2xl font-bold text-gray-900">Software & License Management</h1>
          <p className="text-gray-600 mt-1">Manage software licenses and installations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add License
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
              <p className="text-gray-600 text-sm">Active Licenses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{expiringSoonCount}</p>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{expiredCount}</p>
              <p className="text-gray-600 text-sm">Expired</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
              <p className="text-gray-600 text-sm">Total Investment</p>
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
                placeholder="Search software..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {softwareCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {licenseStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Software Licenses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Software
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No licenses found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((license) => {
                  const usagePercentage = getUsagePercentage(license.usedLicenses, license.totalLicenses);
                  return (
                    <tr key={license.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Download className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{license.softwareName}</div>
                            <div className="text-sm text-gray-500">{license.vendor} • {license.category}</div>
                            <div className="text-sm text-gray-500">{license.licenseType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {license.usedLicenses} / {license.totalLicenses} licenses
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${getUsageColor(usagePercentage)}`}
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{usagePercentage}% used</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                          {license.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {license.expiryDate ? formatDate(license.expiryDate) : 'Perpetual'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Purchased: {formatDate(license.purchaseDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(license.cost)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddLicenseModal />
    </div>
  );
};

export default SoftwareLicenseManagement;