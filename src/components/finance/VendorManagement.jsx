import React, { useState, useEffect } from 'react';
import { Building, Users, DollarSign, TrendingUp, Plus, Search, Download, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [activeTab, setActiveTab] = useState('vendors');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const vendorsData = getFromStorage('financeVendors') || [];
    const transactionsData = getFromStorage('financeVendorTransactions') || [];
    
    setVendors(vendorsData);
    setTransactions(transactionsData);

    // Generate sample data if none exists
    if (vendorsData.length === 0) {
      generateSampleData();
    }
  };

  const generateSampleData = () => {
    const sampleVendors = [
      {
        id: 'VEN001',
        name: 'TechCorp Solutions',
        category: 'IT Services',
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@techcorp.com',
        phone: '+91 9876543210',
        address: '123 Tech Park, Bangalore, Karnataka 560001',
        panNumber: 'ABCDE1234F',
        gstNumber: '29ABCDE1234F1Z5',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'ICIC0001234',
          bankName: 'ICICI Bank'
        },
        paymentTerms: 'Net 30',
        creditLimit: 500000,
        outstandingAmount: 125000,
        rating: 'A',
        status: 'Active',
        registrationDate: '2023-01-15',
        createdAt: new Date().toISOString()
      },
      {
        id: 'VEN002',
        name: 'Office Supplies Hub',
        category: 'Office Supplies',
        contactPerson: 'Priya Sharma',
        email: 'priya@officesupplies.com',
        phone: '+91 9876543211',
        address: '456 Business District, Mumbai, Maharashtra 400001',
        panNumber: 'FGHIJ5678K',
        gstNumber: '27FGHIJ5678K1Z8',
        bankDetails: {
          accountNumber: '2345678901',
          ifscCode: 'HDFC0002345',
          bankName: 'HDFC Bank'
        },
        paymentTerms: 'Net 15',
        creditLimit: 200000,
        outstandingAmount: 45000,
        rating: 'B+',
        status: 'Active',
        registrationDate: '2023-02-20',
        createdAt: new Date().toISOString()
      },
      {
        id: 'VEN003',
        name: 'Facilities Management Co.',
        category: 'Facilities',
        contactPerson: 'Amit Patel',
        email: 'amit@facilities.com',
        phone: '+91 9876543212',
        address: '789 Service Road, Delhi, Delhi 110001',
        panNumber: 'KLMNO9012P',
        gstNumber: '07KLMNO9012P1Z2',
        bankDetails: {
          accountNumber: '3456789012',
          ifscCode: 'SBI0003456',
          bankName: 'State Bank of India'
        },
        paymentTerms: 'Net 45',
        creditLimit: 300000,
        outstandingAmount: 85000,
        rating: 'A-',
        status: 'Active',
        registrationDate: '2022-11-10',
        createdAt: new Date().toISOString()
      },
      {
        id: 'VEN004',
        name: 'Catering Services Ltd.',
        category: 'Food & Beverages',
        contactPerson: 'Sunita Reddy',
        email: 'sunita@catering.com',
        phone: '+91 9876543213',
        address: '321 Food Street, Chennai, Tamil Nadu 600001',
        panNumber: 'QRSTU3456V',
        gstNumber: '33QRSTU3456V1Z9',
        bankDetails: {
          accountNumber: '4567890123',
          ifscCode: 'AXIS0004567',
          bankName: 'Axis Bank'
        },
        paymentTerms: 'Net 7',
        creditLimit: 150000,
        outstandingAmount: 22000,
        rating: 'B',
        status: 'Active',
        registrationDate: '2023-03-25',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleTransactions = [
      {
        id: 'TXN001',
        vendorId: 'VEN001',
        vendorName: 'TechCorp Solutions',
        invoiceNumber: 'INV-2024-001',
        date: '2024-01-15',
        amount: 75000,
        description: 'Software Development Services',
        type: 'Invoice',
        status: 'Paid',
        paymentDate: '2024-02-10',
        dueDate: '2024-02-14',
        createdAt: new Date().toISOString()
      },
      {
        id: 'TXN002',
        vendorId: 'VEN002',
        vendorName: 'Office Supplies Hub',
        invoiceNumber: 'INV-2024-002',
        date: '2024-01-20',
        amount: 25000,
        description: 'Office Stationery and Supplies',
        type: 'Invoice',
        status: 'Pending',
        paymentDate: null,
        dueDate: '2024-02-04',
        createdAt: new Date().toISOString()
      },
      {
        id: 'TXN003',
        vendorId: 'VEN003',
        vendorName: 'Facilities Management Co.',
        invoiceNumber: 'INV-2024-003',
        date: '2024-01-25',
        amount: 45000,
        description: 'Monthly Facility Management',
        type: 'Invoice',
        status: 'Overdue',
        paymentDate: null,
        dueDate: '2024-02-09',
        createdAt: new Date().toISOString()
      },
      {
        id: 'TXN004',
        vendorId: 'VEN004',
        vendorName: 'Catering Services Ltd.',
        invoiceNumber: 'INV-2024-004',
        date: '2024-01-30',
        amount: 12000,
        description: 'Employee Lunch Catering',
        type: 'Invoice',
        status: 'Paid',
        paymentDate: '2024-02-05',
        dueDate: '2024-02-06',
        createdAt: new Date().toISOString()
      }
    ];

    setVendors(sampleVendors);
    setTransactions(sampleTransactions);
    saveToStorage('financeVendors', sampleVendors);
    saveToStorage('financeVendorTransactions', sampleTransactions);
  };

  const categories = ['IT Services', 'Office Supplies', 'Facilities', 'Food & Beverages', 'Consulting', 'Others'];
  const ratings = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C'];

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'Active').length;
  const totalOutstanding = vendors.reduce((sum, vendor) => sum + vendor.outstandingAmount, 0);
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const currentMonth = new Date();
    return transactionDate.getMonth() === currentMonth.getMonth() && 
           transactionDate.getFullYear() === currentMonth.getFullYear();
  }).reduce((sum, t) => sum + t.amount, 0);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchTerm || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || vendor.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const VendorModal = ({ vendor, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: vendor?.name || '',
      category: vendor?.category || '',
      contactPerson: vendor?.contactPerson || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      panNumber: vendor?.panNumber || '',
      gstNumber: vendor?.gstNumber || '',
      bankAccountNumber: vendor?.bankDetails?.accountNumber || '',
      ifscCode: vendor?.bankDetails?.ifscCode || '',
      bankName: vendor?.bankDetails?.bankName || '',
      paymentTerms: vendor?.paymentTerms || 'Net 30',
      creditLimit: vendor?.creditLimit || '',
      rating: vendor?.rating || 'B',
      status: vendor?.status || 'Active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const vendorData = {
        ...formData,
        id: vendor?.id || `VEN${Date.now()}`,
        creditLimit: parseFloat(formData.creditLimit),
        outstandingAmount: vendor?.outstandingAmount || 0,
        bankDetails: {
          accountNumber: formData.bankAccountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName
        },
        registrationDate: vendor?.registrationDate || new Date().toISOString().split('T')[0],
        createdAt: vendor?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(vendorData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Net 7">Net 7 Days</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {ratings.map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                {vendor ? 'Update Vendor' : 'Add Vendor'}
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

  const handleSaveVendor = (vendorData) => {
    let updatedVendors;
    if (editingVendor) {
      updatedVendors = vendors.map(vendor => 
        vendor.id === editingVendor.id ? vendorData : vendor
      );
    } else {
      updatedVendors = [...vendors, vendorData];
    }
    
    setVendors(updatedVendors);
    saveToStorage('financeVendors', updatedVendors);
    setShowAddModal(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      const updatedVendors = vendors.filter(vendor => vendor.id !== vendorId);
      setVendors(updatedVendors);
      saveToStorage('financeVendors', updatedVendors);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">Manage vendors and track transactions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
              <p className="text-gray-600 text-sm">Total Vendors</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
              <p className="text-gray-600 text-sm">Active Vendors</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-gray-600 text-sm">Outstanding</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyTransactions)}</p>
              <p className="text-gray-600 text-sm">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vendors'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transactions
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            {activeTab === 'vendors' && (
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
            )}
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'vendors' ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
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
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">No vendors found</p>
                      <p className="text-sm">Add your first vendor to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.id} • {vendor.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.contactPerson}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {vendor.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {vendor.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Credit: {formatCurrency(vendor.creditLimit)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Outstanding: {formatCurrency(vendor.outstandingAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Terms: {vendor.paymentTerms}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.rating?.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                          vendor.rating?.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vendor.rating || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          vendor.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingVendor(vendor);
                              setShowAddModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor.id)}
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
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm">Transactions will appear here as they are created</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.vendorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(transaction.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Vendor Modal */}
      {showAddModal && (
        <VendorModal
          vendor={editingVendor}
          onClose={() => {
            setShowAddModal(false);
            setEditingVendor(null);
          }}
          onSave={handleSaveVendor}
        />
      )}
    </div>
  );
};

export default VendorManagement;

