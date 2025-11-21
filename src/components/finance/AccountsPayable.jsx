import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const AccountsPayable = () => {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const invoiceStatuses = ['Pending', 'Approved', 'Paid', 'Overdue', 'Cancelled'];
  const paymentTerms = ['Net 30', 'Net 15', 'Net 7', 'Due on Receipt', 'COD'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const vendorsData = getFromStorage('financeVendors') || [];
    const invoicesData = getFromStorage('financeInvoices') || [];
    
    setVendors(vendorsData);
    setInvoices(invoicesData);

    // Generate sample data if none exists
    if (vendorsData.length === 0) {
      generateSampleVendors();
    }
    if (invoicesData.length === 0) {
      generateSampleInvoices();
    }
  };

  const generateSampleVendors = () => {
    const sampleVendors = [
      {
        id: 'VEN001',
        name: 'Tech Solutions Pvt Ltd',
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@techsolutions.com',
        phone: '+91 98765 43210',
        address: 'Mumbai, Maharashtra',
        paymentTerms: 'Net 30',
        taxId: 'GST123456789',
        status: 'Active'
      },
      {
        id: 'VEN002',
        name: 'Office Supplies Co',
        contactPerson: 'Priya Sharma',
        email: 'priya@officesupplies.com',
        phone: '+91 98765 43211',
        address: 'Delhi, India',
        paymentTerms: 'Net 15',
        taxId: 'GST987654321',
        status: 'Active'
      },
      {
        id: 'VEN003',
        name: 'Facility Management Services',
        contactPerson: 'Amit Patel',
        email: 'amit@facilityservices.com',
        phone: '+91 98765 43212',
        address: 'Bangalore, Karnataka',
        paymentTerms: 'Net 30',
        taxId: 'GST456789123',
        status: 'Active'
      }
    ];

    setVendors(sampleVendors);
    saveToStorage('financeVendors', sampleVendors);
  };

  const generateSampleInvoices = () => {
    const sampleInvoices = [
      {
        id: 'INV001',
        invoiceNumber: 'TS-2024-001',
        vendorId: 'VEN001',
        vendorName: 'Tech Solutions Pvt Ltd',
        description: 'Software licenses and support',
        amount: 150000,
        taxAmount: 27000,
        totalAmount: 177000,
        invoiceDate: '2024-03-01',
        dueDate: '2024-03-31',
        status: 'Pending',
        paymentTerms: 'Net 30',
        purchaseOrderNumber: 'PO-2024-001',
        approvedBy: null,
        approvedDate: null,
        paidDate: null,
        paymentMethod: null,
        remarks: 'Annual software license renewal'
      },
      {
        id: 'INV002',
        invoiceNumber: 'OS-2024-002',
        vendorId: 'VEN002',
        vendorName: 'Office Supplies Co',
        description: 'Office stationery and supplies',
        amount: 25000,
        taxAmount: 4500,
        totalAmount: 29500,
        invoiceDate: '2024-02-28',
        dueDate: '2024-03-15',
        status: 'Approved',
        paymentTerms: 'Net 15',
        purchaseOrderNumber: 'PO-2024-002',
        approvedBy: 'Finance Manager',
        approvedDate: '2024-03-05',
        paidDate: null,
        paymentMethod: null,
        remarks: 'Monthly office supplies'
      },
      {
        id: 'INV003',
        invoiceNumber: 'FM-2024-003',
        vendorId: 'VEN003',
        vendorName: 'Facility Management Services',
        description: 'Office cleaning and maintenance',
        amount: 45000,
        taxAmount: 8100,
        totalAmount: 53100,
        invoiceDate: '2024-02-25',
        dueDate: '2024-03-27',
        status: 'Paid',
        paymentTerms: 'Net 30',
        purchaseOrderNumber: 'PO-2024-003',
        approvedBy: 'Finance Manager',
        approvedDate: '2024-03-01',
        paidDate: '2024-03-10',
        paymentMethod: 'Bank Transfer',
        remarks: 'Monthly facility maintenance'
      },
      {
        id: 'INV004',
        invoiceNumber: 'TS-2024-004',
        vendorId: 'VEN001',
        vendorName: 'Tech Solutions Pvt Ltd',
        description: 'Hardware procurement',
        amount: 85000,
        taxAmount: 15300,
        totalAmount: 100300,
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-14',
        status: 'Overdue',
        paymentTerms: 'Net 30',
        purchaseOrderNumber: 'PO-2024-004',
        approvedBy: 'Finance Manager',
        approvedDate: '2024-01-20',
        paidDate: null,
        paymentMethod: null,
        remarks: 'Laptop and accessories'
      }
    ];

    setInvoices(sampleInvoices);
    saveToStorage('financeInvoices', sampleInvoices);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = invoices.filter(invoice => invoice.status === 'Pending').length;
  const approvedCount = invoices.filter(invoice => invoice.status === 'Approved').length;
  const overdueCount = invoices.filter(invoice => invoice.status === 'Overdue').length;
  const totalPayable = invoices
    .filter(invoice => ['Pending', 'Approved', 'Overdue'].includes(invoice.status))
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

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
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveInvoice = (invoiceId) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === invoiceId
        ? { ...invoice, status: 'Approved', approvedBy: 'Finance Manager', approvedDate: new Date().toISOString().split('T')[0] }
        : invoice
    );
    setInvoices(updatedInvoices);
    saveToStorage('financeInvoices', updatedInvoices);
  };

  const handlePayInvoice = (invoiceId) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === invoiceId
        ? { 
            ...invoice, 
            status: 'Paid', 
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Bank Transfer'
          }
        : invoice
    );
    setInvoices(updatedInvoices);
    saveToStorage('financeInvoices', updatedInvoices);
  };

  const AddInvoiceModal = () => {
    const [formData, setFormData] = useState({
      vendorId: '',
      invoiceNumber: '',
      description: '',
      amount: '',
      taxAmount: '',
      invoiceDate: '',
      paymentTerms: 'Net 30',
      purchaseOrderNumber: '',
      remarks: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedVendor = vendors.find(vendor => vendor.id === formData.vendorId);
      
      const amount = parseFloat(formData.amount);
      const taxAmount = parseFloat(formData.taxAmount) || 0;
      const totalAmount = amount + taxAmount;
      
      // Calculate due date based on payment terms
      const invoiceDate = new Date(formData.invoiceDate);
      const daysToAdd = parseInt(formData.paymentTerms.replace('Net ', '')) || 0;
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd);

      const newInvoice = {
        id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
        invoiceNumber: formData.invoiceNumber,
        vendorId: formData.vendorId,
        vendorName: selectedVendor?.name,
        description: formData.description,
        amount: amount,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        invoiceDate: formData.invoiceDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Pending',
        paymentTerms: formData.paymentTerms,
        purchaseOrderNumber: formData.purchaseOrderNumber,
        approvedBy: null,
        approvedDate: null,
        paidDate: null,
        paymentMethod: null,
        remarks: formData.remarks
      };

      const updatedInvoices = [...invoices, newInvoice];
      setInvoices(updatedInvoices);
      saveToStorage('financeInvoices', updatedInvoices);
      setShowAddModal(false);
      setFormData({
        vendorId: '',
        invoiceNumber: '',
        description: '',
        amount: '',
        taxAmount: '',
        invoiceDate: '',
        paymentTerms: 'Net 30',
        purchaseOrderNumber: '',
        remarks: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Invoice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.vendorId}
                onChange={(e) => setFormData({...formData, vendorId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Invoice Number"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Amount (excluding tax)"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Tax Amount"
                value={formData.taxAmount}
                onChange={(e) => setFormData({...formData, taxAmount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {paymentTerms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Purchase Order Number"
                value={formData.purchaseOrderNumber}
                onChange={(e) => setFormData({...formData, purchaseOrderNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <textarea
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add Invoice
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
          <h1 className="text-2xl font-bold text-gray-900">Accounts Payable</h1>
          <p className="text-gray-600 mt-1">Manage vendor invoices and payments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-gray-600 text-sm">Pending Invoices</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              <p className="text-gray-600 text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              <p className="text-gray-600 text-sm">Overdue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayable)}</p>
              <p className="text-gray-600 text-sm">Total Payable</p>
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
                placeholder="Search invoices..."
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
            {invoiceStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Vendor Invoices</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Details
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No invoices found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.description}</div>
                        <div className="text-sm text-gray-500">
                          PO: {invoice.purchaseOrderNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.vendorName}</div>
                      <div className="text-sm text-gray-500">{invoice.paymentTerms}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Base: {formatCurrency(invoice.amount)}
                      </div>
                      {invoice.taxAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          Tax: {formatCurrency(invoice.taxAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Invoice: {formatDate(invoice.invoiceDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {invoice.status === 'Pending' && (
                          <button
                            onClick={() => handleApproveInvoice(invoice.id)}
                            className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200"
                          >
                            Approve
                          </button>
                        )}
                        {invoice.status === 'Approved' && (
                          <button
                            onClick={() => handlePayInvoice(invoice.id)}
                            className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddInvoiceModal />
    </div>
  );
};

export default AccountsPayable;