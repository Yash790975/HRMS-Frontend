import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Filter, Check, X, Clock, DollarSign, User } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const ExpenseManagement = () => {
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const expenseCategories = ['Travel', 'Meals', 'Accommodation', 'Transportation', 'Office Supplies', 'Training', 'Communication', 'Medical', 'Other'];
  const expenseStatuses = ['Pending', 'Approved', 'Rejected', 'Reimbursed', 'Under Review'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const expenseData = getFromStorage('financeExpenseRecords') || [];
    
    setEmployees(employeesData);
    setExpenseRecords(expenseData);

    // Generate sample expense data if none exists
    if (expenseData.length === 0 && employeesData.length > 0) {
      generateSampleExpenses(employeesData);
    }
  };

  const generateSampleExpenses = (employeesData) => {
    const sampleExpenses = [
      {
        id: 'EXP001',
        employeeId: employeesData[0]?.id,
        employeeName: employeesData[0]?.personalDetails?.fullName,
        employeeCode: employeesData[0]?.employmentDetails?.employeeId,
        department: employeesData[0]?.employmentDetails?.department,
        category: 'Travel',
        description: 'Business trip to Delhi for client meeting',
        amount: 15000,
        date: '2024-03-10',
        status: 'Pending',
        submittedDate: '2024-03-12',
        approvedBy: null,
        approvedDate: null,
        reimbursedDate: null,
        receiptUrl: null,
        billNumber: 'TRV001',
        vendorName: 'Airlines India',
        paymentMethod: 'Credit Card',
        taxAmount: 2700,
        remarks: 'Client meeting in Delhi office'
      },
      {
        id: 'EXP002',
        employeeId: employeesData[1]?.id,
        employeeName: employeesData[1]?.personalDetails?.fullName,
        employeeCode: employeesData[1]?.employmentDetails?.employeeId,
        department: employeesData[1]?.employmentDetails?.department,
        category: 'Meals',
        description: 'Client dinner meeting',
        amount: 2500,
        date: '2024-03-08',
        status: 'Approved',
        submittedDate: '2024-03-09',
        approvedBy: 'Finance Manager',
        approvedDate: '2024-03-10',
        reimbursedDate: null,
        receiptUrl: null,
        billNumber: 'MEAL001',
        vendorName: 'Restaurant XYZ',
        paymentMethod: 'Cash',
        taxAmount: 450,
        remarks: 'Business dinner with client'
      },
      {
        id: 'EXP003',
        employeeId: employeesData[2]?.id,
        employeeName: employeesData[2]?.personalDetails?.fullName,
        employeeCode: employeesData[2]?.employmentDetails?.employeeId,
        department: employeesData[2]?.employmentDetails?.department,
        category: 'Office Supplies',
        description: 'Laptop accessories and stationery',
        amount: 3500,
        date: '2024-03-05',
        status: 'Reimbursed',
        submittedDate: '2024-03-06',
        approvedBy: 'Finance Manager',
        approvedDate: '2024-03-07',
        reimbursedDate: '2024-03-08',
        receiptUrl: null,
        billNumber: 'OFF001',
        vendorName: 'Office Mart',
        paymentMethod: 'Credit Card',
        taxAmount: 630,
        remarks: 'Essential office supplies'
      },
      {
        id: 'EXP004',
        employeeId: employeesData[3]?.id,
        employeeName: employeesData[3]?.personalDetails?.fullName,
        employeeCode: employeesData[3]?.employmentDetails?.employeeId,
        department: employeesData[3]?.employmentDetails?.department,
        category: 'Training',
        description: 'Professional certification course',
        amount: 25000,
        date: '2024-03-01',
        status: 'Under Review',
        submittedDate: '2024-03-02',
        approvedBy: null,
        approvedDate: null,
        reimbursedDate: null,
        receiptUrl: null,
        billNumber: 'TRN001',
        vendorName: 'Training Institute',
        paymentMethod: 'Bank Transfer',
        taxAmount: 4500,
        remarks: 'AWS certification course'
      }
    ];

    setExpenseRecords(sampleExpenses);
    saveToStorage('financeExpenseRecords', sampleExpenses);
  };

  const filteredExpenses = expenseRecords.filter(expense => {
    const matchesSearch = !searchTerm || 
      expense.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || expense.status === filterStatus;
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingCount = expenseRecords.filter(expense => expense.status === 'Pending').length;
  const approvedCount = expenseRecords.filter(expense => expense.status === 'Approved').length;
  const reimbursedCount = expenseRecords.filter(expense => expense.status === 'Reimbursed').length;
  const totalAmount = expenseRecords.reduce((sum, expense) => sum + expense.amount, 0);
  const reimbursedAmount = expenseRecords
    .filter(expense => expense.status === 'Reimbursed')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleApproveExpense = (expenseId) => {
    const updatedExpenses = expenseRecords.map(expense =>
      expense.id === expenseId
        ? { ...expense, status: 'Approved', approvedBy: 'Finance Manager', approvedDate: new Date().toISOString().split('T')[0] }
        : expense
    );
    setExpenseRecords(updatedExpenses);
    saveToStorage('financeExpenseRecords', updatedExpenses);
  };

  const handleRejectExpense = (expenseId) => {
    const updatedExpenses = expenseRecords.map(expense =>
      expense.id === expenseId
        ? { ...expense, status: 'Rejected', approvedBy: 'Finance Manager', approvedDate: new Date().toISOString().split('T')[0] }
        : expense
    );
    setExpenseRecords(updatedExpenses);
    saveToStorage('financeExpenseRecords', updatedExpenses);
  };

  const handleReimburseExpense = (expenseId) => {
    const updatedExpenses = expenseRecords.map(expense =>
      expense.id === expenseId
        ? { ...expense, status: 'Reimbursed', reimbursedDate: new Date().toISOString().split('T')[0] }
        : expense
    );
    setExpenseRecords(updatedExpenses);
    saveToStorage('financeExpenseRecords', updatedExpenses);
  };

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
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AddExpenseModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      category: '',
      description: '',
      amount: '',
      date: '',
      billNumber: '',
      vendorName: '',
      paymentMethod: 'Credit Card',
      taxAmount: '',
      remarks: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

      const newExpense = {
        id: `EXP${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        employeeCode: selectedEmployee?.employmentDetails?.employeeId,
        department: selectedEmployee?.employmentDetails?.department,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedDate: null,
        reimbursedDate: null,
        receiptUrl: null,
        billNumber: formData.billNumber,
        vendorName: formData.vendorName,
        paymentMethod: formData.paymentMethod,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        remarks: formData.remarks
      };

      const updatedExpenses = [...expenseRecords, newExpense];
      setExpenseRecords(updatedExpenses);
      saveToStorage('financeExpenseRecords', updatedExpenses);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        category: '',
        description: '',
        amount: '',
        date: '',
        billNumber: '',
        vendorName: '',
        paymentMethod: 'Credit Card',
        taxAmount: '',
        remarks: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Expense Record</h3>
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
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                {expenseCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Bill Number"
                value={formData.billNumber}
                onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Vendor Name"
                value={formData.vendorName}
                onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Debit Card">Debit Card</option>
              </select>
              <input
                type="number"
                placeholder="Tax Amount"
                value={formData.taxAmount}
                onChange={(e) => setFormData({...formData, taxAmount: e.target.value})}
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
                Add Expense
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
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee expense claims</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              <p className="text-gray-600 text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{reimbursedCount}</p>
              <p className="text-gray-600 text-sm">Reimbursed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              <p className="text-gray-600 text-sm">Total Claims</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reimbursedAmount)}</p>
              <p className="text-gray-600 text-sm">Paid Out</p>
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
                placeholder="Search expenses..."
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
            {expenseCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {expenseStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Expense Claims</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expense Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No expense records found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{expense.employeeName}</div>
                          <div className="text-sm text-gray-500">{expense.employeeCode} • {expense.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{expense.category}</div>
                        <div className="text-sm text-gray-500">{expense.description}</div>
                        <div className="text-sm text-gray-500">
                          {expense.billNumber} • {formatDate(expense.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                      {expense.taxAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          Tax: {formatCurrency(expense.taxAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {expense.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveExpense(expense.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectExpense(expense.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {expense.status === 'Approved' && (
                          <button
                            onClick={() => handleReimburseExpense(expense.id)}
                            className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200"
                          >
                            Reimburse
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

      <AddExpenseModal />
    </div>
  );
};

export default ExpenseManagement;