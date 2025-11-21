import React, { useState, useEffect } from 'react';
import { Gift, Plus, Search, Filter, User, DollarSign, Calendar, Check, Shield } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const BenefitsAdministration = () => {
  const [benefits, setBenefits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const benefitTypes = [
    'Health Insurance',
    'Life Insurance',
    'Provident Fund',
    'Gratuity',
    'Bonus',
    'Performance Incentive',
    'Travel Allowance',
    'Medical Allowance',
    'Education Allowance',
    'Retirement Benefits'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const benefitsData = getFromStorage('financeBenefits') || [];
    
    setEmployees(employeesData);
    setBenefits(benefitsData);

    // Generate sample benefits data if none exists
    if (benefitsData.length === 0 && employeesData.length > 0) {
      generateSampleBenefits(employeesData);
    }
  };

  const generateSampleBenefits = (employeesData) => {
    const sampleBenefits = [
      {
        id: 'BEN001',
        employeeId: employeesData[0]?.id,
        employeeName: employeesData[0]?.personalDetails?.fullName,
        employeeCode: employeesData[0]?.employmentDetails?.employeeId,
        department: employeesData[0]?.employmentDetails?.department,
        benefitType: 'Health Insurance',
        provider: 'Star Health Insurance',
        coverage: 'Family (Self + Spouse + 2 Children)',
        amount: 500000,
        premium: 25000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Active',
        enrolledDate: '2024-01-01',
        policyNumber: 'SH2024001',
        claimsMade: 1,
        claimsAmount: 15000
      },
      {
        id: 'BEN002',
        employeeId: employeesData[1]?.id,
        employeeName: employeesData[1]?.personalDetails?.fullName,
        employeeCode: employeesData[1]?.employmentDetails?.employeeId,
        department: employeesData[1]?.employmentDetails?.department,
        benefitType: 'Provident Fund',
        provider: 'EPFO',
        coverage: '12% of Basic Salary',
        amount: 72000,
        premium: 0,
        startDate: '2024-02-01',
        endDate: null,
        status: 'Active',
        enrolledDate: '2024-02-01',
        policyNumber: 'PF2024002',
        claimsMade: 0,
        claimsAmount: 0
      },
      {
        id: 'BEN003',
        employeeId: employeesData[2]?.id,
        employeeName: employeesData[2]?.personalDetails?.fullName,
        employeeCode: employeesData[2]?.employmentDetails?.employeeId,
        department: employeesData[2]?.employmentDetails?.department,
        benefitType: 'Life Insurance',
        provider: 'LIC of India',
        coverage: '10x Annual Salary',
        amount: 5000000,
        premium: 15000,
        startDate: '2024-02-15',
        endDate: '2025-02-14',
        status: 'Active',
        enrolledDate: '2024-02-15',
        policyNumber: 'LIC2024003',
        claimsMade: 0,
        claimsAmount: 0
      },
      {
        id: 'BEN004',
        employeeId: employeesData[0]?.id,
        employeeName: employeesData[0]?.personalDetails?.fullName,
        employeeCode: employeesData[0]?.employmentDetails?.employeeId,
        department: employeesData[0]?.employmentDetails?.department,
        benefitType: 'Performance Incentive',
        provider: 'Company',
        coverage: 'Quarterly Performance Bonus',
        amount: 50000,
        premium: 0,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Active',
        enrolledDate: '2024-01-01',
        policyNumber: 'PI2024004',
        claimsMade: 2,
        claimsAmount: 100000
      },
      {
        id: 'BEN005',
        employeeId: employeesData[3]?.id,
        employeeName: employeesData[3]?.personalDetails?.fullName,
        employeeCode: employeesData[3]?.employmentDetails?.employeeId,
        department: employeesData[3]?.employmentDetails?.department,
        benefitType: 'Medical Allowance',
        provider: 'Company',
        coverage: 'Monthly Medical Reimbursement',
        amount: 5000,
        premium: 0,
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        status: 'Active',
        enrolledDate: '2024-03-01',
        policyNumber: 'MA2024005',
        claimsMade: 3,
        claimsAmount: 12000
      }
    ];

    setBenefits(sampleBenefits);
    saveToStorage('financeBenefits', sampleBenefits);
  };

  const filteredBenefits = benefits.filter(benefit => {
    const matchesSearch = !searchTerm || 
      benefit.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.benefitType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.provider?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || benefit.benefitType === filterType;
    return matchesSearch && matchesType;
  });

  const activeCount = benefits.filter(benefit => benefit.status === 'Active').length;
  const totalCoverage = benefits.reduce((sum, benefit) => sum + benefit.amount, 0);
  const totalPremium = benefits.reduce((sum, benefit) => sum + benefit.premium, 0);
  const uniqueEmployees = new Set(benefits.map(benefit => benefit.employeeId)).size;
  const totalClaims = benefits.reduce((sum, benefit) => sum + benefit.claimsAmount, 0);

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
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AddBenefitModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      benefitType: '',
      provider: '',
      coverage: '',
      amount: '',
      premium: '',
      startDate: '',
      endDate: '',
      policyNumber: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

      const newBenefit = {
        id: `BEN${String(benefits.length + 1).padStart(3, '0')}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        employeeCode: selectedEmployee?.employmentDetails?.employeeId,
        department: selectedEmployee?.employmentDetails?.department,
        benefitType: formData.benefitType,
        provider: formData.provider,
        coverage: formData.coverage,
        amount: parseFloat(formData.amount),
        premium: parseFloat(formData.premium) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: 'Active',
        enrolledDate: new Date().toISOString().split('T')[0],
        policyNumber: formData.policyNumber,
        claimsMade: 0,
        claimsAmount: 0
      };

      const updatedBenefits = [...benefits, newBenefit];
      setBenefits(updatedBenefits);
      saveToStorage('financeBenefits', updatedBenefits);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        benefitType: '',
        provider: '',
        coverage: '',
        amount: '',
        premium: '',
        startDate: '',
        endDate: '',
        policyNumber: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Employee Benefit</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <select
                value={formData.benefitType}
                onChange={(e) => setFormData({...formData, benefitType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Benefit Type</option>
                {benefitTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Provider"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Coverage Details"
                value={formData.coverage}
                onChange={(e) => setFormData({...formData, coverage: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Coverage Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="Premium Amount (if any)"
                value={formData.premium}
                onChange={(e) => setFormData({...formData, premium: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                placeholder="End Date (optional)"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Policy Number"
                value={formData.policyNumber}
                onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add Benefit
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
          <h1 className="text-2xl font-bold text-gray-900">Benefits Administration</h1>
          <p className="text-gray-600 mt-1">Manage employee benefits and compensation packages</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Benefit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-gray-600 text-sm">Active Benefits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{uniqueEmployees}</p>
              <p className="text-gray-600 text-sm">Enrolled Employees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoverage)}</p>
              <p className="text-gray-600 text-sm">Total Coverage</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPremium)}</p>
              <p className="text-gray-600 text-sm">Total Premium</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalClaims)}</p>
              <p className="text-gray-600 text-sm">Claims Paid</p>
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
                placeholder="Search benefits..."
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
            <option value="">All Benefit Types</option>
            {benefitTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Benefits Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Employee Benefits</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider & Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claims
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBenefits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No benefits found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredBenefits.map((benefit) => (
                  <tr key={benefit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {benefit.employeeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {benefit.employeeCode} • {benefit.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{benefit.benefitType}</div>
                      <div className="text-sm text-gray-500">
                        Policy: {benefit.policyNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{benefit.provider}</div>
                      <div className="text-sm text-gray-500">{benefit.coverage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(benefit.amount)}
                      </div>
                      {benefit.premium > 0 && (
                        <div className="text-sm text-gray-500">
                          Premium: {formatCurrency(benefit.premium)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(benefit.startDate)}
                      </div>
                      {benefit.endDate && (
                        <div className="text-sm text-gray-500">
                          to {formatDate(benefit.endDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {benefit.claimsMade} claims
                      </div>
                      {benefit.claimsAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          {formatCurrency(benefit.claimsAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(benefit.status)}`}>
                        {benefit.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddBenefitModal />
    </div>
  );
};

export default BenefitsAdministration;