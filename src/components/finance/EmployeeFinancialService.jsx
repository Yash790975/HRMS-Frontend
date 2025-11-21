import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Users, Plus, Search, Download, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const EmployeeFinancialService = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [activeTab, setActiveTab] = useState('loans');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const servicesData = getFromStorage('employeeFinancialServices') || [];
    
    setEmployees(employeesData);
    setServices(servicesData);

    // Generate sample data if none exists
    if (servicesData.length === 0 && employeesData.length > 0) {
      generateSampleData(employeesData);
    }
  };

  const generateSampleData = (employeesData) => {
    const sampleServices = [
      {
        id: 'EFS001',
        employeeId: employeesData[0]?.id || 'EMP001',
        employeeName: employeesData[0]?.personalDetails?.fullName || 'John Doe',
        employeeCode: employeesData[0]?.employmentDetails?.employeeId || 'EMP001',
        department: employeesData[0]?.employmentDetails?.department || 'IT',
        type: 'Personal Loan',
        amount: 200000,
        approvedAmount: 200000,
        interestRate: 8.5,
        tenure: 24,
        emiAmount: 9168,
        remainingAmount: 150000,
        paidAmount: 50000,
        status: 'Active',
        applicationDate: '2023-06-15',
        approvalDate: '2023-06-20',
        disbursementDate: '2023-06-25',
        nextEmiDate: '2024-02-25',
        purpose: 'Home renovation',
        createdAt: new Date().toISOString()
      },
      {
        id: 'EFS002',
        employeeId: employeesData[1]?.id || 'EMP002',
        employeeName: employeesData[1]?.personalDetails?.fullName || 'Jane Smith',
        employeeCode: employeesData[1]?.employmentDetails?.employeeId || 'EMP002',
        department: employeesData[1]?.employmentDetails?.department || 'HR',
        type: 'Salary Advance',
        amount: 50000,
        approvedAmount: 50000,
        interestRate: 0,
        tenure: 6,
        emiAmount: 8333,
        remainingAmount: 25000,
        paidAmount: 25000,
        status: 'Active',
        applicationDate: '2024-01-10',
        approvalDate: '2024-01-12',
        disbursementDate: '2024-01-15',
        nextEmiDate: '2024-02-15',
        purpose: 'Medical emergency',
        createdAt: new Date().toISOString()
      },
      {
        id: 'EFS003',
        employeeId: employeesData[2]?.id || 'EMP003',
        employeeName: employeesData[2]?.personalDetails?.fullName || 'Mike Johnson',
        employeeCode: employeesData[2]?.employmentDetails?.employeeId || 'EMP003',
        department: employeesData[2]?.employmentDetails?.department || 'Finance',
        type: 'Education Loan',
        amount: 300000,
        approvedAmount: 250000,
        interestRate: 6.5,
        tenure: 36,
        emiAmount: 7637,
        remainingAmount: 240000,
        paidAmount: 10000,
        status: 'Active',
        applicationDate: '2023-09-01',
        approvalDate: '2023-09-05',
        disbursementDate: '2023-09-10',
        nextEmiDate: '2024-02-10',
        purpose: 'Child education',
        createdAt: new Date().toISOString()
      },
      {
        id: 'EFS004',
        employeeId: employeesData[3]?.id || 'EMP004',
        employeeName: employeesData[3]?.personalDetails?.fullName || 'Sarah Wilson',
        employeeCode: employeesData[3]?.employmentDetails?.employeeId || 'EMP004',
        department: employeesData[3]?.employmentDetails?.department || 'Marketing',
        type: 'Travel Advance',
        amount: 25000,
        approvedAmount: 25000,
        interestRate: 0,
        tenure: 1,
        emiAmount: 25000,
        remainingAmount: 0,
        paidAmount: 25000,
        status: 'Completed',
        applicationDate: '2023-12-01',
        approvalDate: '2023-12-01',
        disbursementDate: '2023-12-02',
        nextEmiDate: null,
        purpose: 'Business travel',
        createdAt: new Date().toISOString()
      },
      {
        id: 'EFS005',
        employeeId: employeesData[4]?.id || 'EMP005',
        employeeName: employeesData[4]?.personalDetails?.fullName || 'Tom Brown',
        employeeCode: employeesData[4]?.employmentDetails?.employeeId || 'EMP005',
        department: employeesData[4]?.employmentDetails?.department || 'Operations',
        type: 'Vehicle Loan',
        amount: 500000,
        approvedAmount: 450000,
        interestRate: 9.5,
        tenure: 48,
        emiAmount: 11392,
        remainingAmount: 420000,
        paidAmount: 30000,
        status: 'Active',
        applicationDate: '2023-08-15',
        approvalDate: '2023-08-20',
        disbursementDate: '2023-08-25',
        nextEmiDate: '2024-02-25',
        purpose: 'Two-wheeler purchase',
        createdAt: new Date().toISOString()
      }
    ];

    setServices(sampleServices);
    saveToStorage('employeeFinancialServices', sampleServices);
  };

  const serviceTypes = [
    'Personal Loan',
    'Salary Advance',
    'Education Loan',
    'Travel Advance',
    'Vehicle Loan',
    'Medical Advance',
    'Festival Advance',
    'Emergency Loan'
  ];

  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const totalOutstanding = services.reduce((sum, service) => sum + service.remainingAmount, 0);
  const totalDisbursed = services.reduce((sum, service) => sum + service.approvedAmount, 0);

  const loanServices = services.filter(s => ['Personal Loan', 'Education Loan', 'Vehicle Loan', 'Emergency Loan'].includes(s.type));
  const advanceServices = services.filter(s => ['Salary Advance', 'Travel Advance', 'Medical Advance', 'Festival Advance'].includes(s.type));

  const getFilteredServices = () => {
    const baseServices = activeTab === 'loans' ? loanServices : advanceServices;
    
    return baseServices.filter(service => {
      const matchesSearch = !searchTerm || 
        service.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || service.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const ServiceModal = ({ service, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      employeeId: service?.employeeId || '',
      type: service?.type || 'Personal Loan',
      amount: service?.amount || '',
      interestRate: service?.interestRate || '',
      tenure: service?.tenure || '',
      purpose: service?.purpose || '',
      status: service?.status || 'Pending'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      const amount = parseFloat(formData.amount);
      const interestRate = parseFloat(formData.interestRate) || 0;
      const tenure = parseInt(formData.tenure);
      
      // Calculate EMI using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
      let emiAmount = 0;
      if (interestRate > 0) {
        const monthlyRate = interestRate / 100 / 12;
        const power = Math.pow(1 + monthlyRate, tenure);
        emiAmount = (amount * monthlyRate * power) / (power - 1);
      } else {
        emiAmount = amount / tenure;
      }

      const serviceData = {
        ...formData,
        id: service?.id || `EFS${Date.now()}`,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        employeeCode: selectedEmployee?.employmentDetails?.employeeId,
        department: selectedEmployee?.employmentDetails?.department,
        amount: amount,
        approvedAmount: amount,
        interestRate: interestRate,
        tenure: tenure,
        emiAmount: Math.round(emiAmount),
        remainingAmount: service?.remainingAmount || amount,
        paidAmount: service?.paidAmount || 0,
        applicationDate: service?.applicationDate || new Date().toISOString().split('T')[0],
        approvalDate: service?.approvalDate || new Date().toISOString().split('T')[0],
        disbursementDate: service?.disbursementDate || new Date().toISOString().split('T')[0],
        nextEmiDate: service?.nextEmiDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: service?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(serviceData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {service ? 'Edit Financial Service' : 'Add New Financial Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.personalDetails?.fullName} - {emp.employmentDetails?.employeeId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months)</label>
                <input
                  type="number"
                  value={formData.tenure}
                  onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                {service ? 'Update Service' : 'Add Service'}
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

  const handleSaveService = (serviceData) => {
    let updatedServices;
    if (editingService) {
      updatedServices = services.map(service => 
        service.id === editingService.id ? serviceData : service
      );
    } else {
      updatedServices = [...services, serviceData];
    }
    
    setServices(updatedServices);
    saveToStorage('employeeFinancialServices', updatedServices);
    setShowAddModal(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(service => service.id !== serviceId);
      setServices(updatedServices);
      saveToStorage('employeeFinancialServices', updatedServices);
    }
  };

  const handleApproveService = (serviceId) => {
    const updatedServices = services.map(service => 
      service.id === serviceId ? { ...service, status: 'Approved' } : service
    );
    setServices(updatedServices);
    saveToStorage('employeeFinancialServices', updatedServices);
  };

  const handleRejectService = (serviceId) => {
    const updatedServices = services.map(service => 
      service.id === serviceId ? { ...service, status: 'Rejected' } : service
    );
    setServices(updatedServices);
    saveToStorage('employeeFinancialServices', updatedServices);
  };

  const filteredServices = getFilteredServices();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Financial Services</h1>
          <p className="text-gray-600 mt-1">Manage employee loans, advances, and financial services</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              <p className="text-gray-600 text-sm">Total Services</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
              <p className="text-gray-600 text-sm">Active Services</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDisbursed)}</p>
              <p className="text-gray-600 text-sm">Total Disbursed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-gray-600 text-sm">Outstanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('loans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'loans'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Loans ({loanServices.length})
            </button>
            <button
              onClick={() => setActiveTab('advances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advances'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Advances ({advanceServices.length})
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
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {serviceTypes.filter(type => 
                activeTab === 'loans' 
                  ? ['Personal Loan', 'Education Loan', 'Vehicle Loan', 'Emergency Loan'].includes(type)
                  : ['Salary Advance', 'Travel Advance', 'Medical Advance', 'Festival Advance'].includes(type)
              ).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMI Details
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
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No services found</p>
                    <p className="text-sm">Add your first financial service to get started</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.employeeName}</div>
                        <div className="text-sm text-gray-500">{service.employeeCode} • {service.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.type}</div>
                        <div className="text-sm text-gray-500">{service.id}</div>
                        <div className="text-sm text-gray-500">{service.purpose}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(service.approvedAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Outstanding: {formatCurrency(service.remainingAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        EMI: {formatCurrency(service.emiAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.interestRate}% | {service.tenure} months
                      </div>
                      {service.nextEmiDate && (
                        <div className="text-sm text-gray-500">
                          Next: {formatDate(service.nextEmiDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        service.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        service.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        service.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {service.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveService(service.id)}
                              className="text-emerald-600 hover:text-emerald-900"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectService(service.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowAddModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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

      {/* Service Modal */}
      {showAddModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowAddModal(false);
            setEditingService(null);
          }}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
};

export default EmployeeFinancialService;