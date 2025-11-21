import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Plus, Filter, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyExpenses = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock expenses data
  const [expenses] = useState([
    {
      id: '1',
      title: 'Business Travel - Client Meeting',
      description: 'Flight and hotel expenses for client presentation in New York',
      amount: 850.00,
      category: 'travel',
      date: '2024-01-15',
      status: 'approved',
      submittedDate: '2024-01-16',
      approvedDate: '2024-01-18',
      receipts: ['flight-receipt.pdf', 'hotel-receipt.pdf'],
      reimbursementDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'Office Supplies',
      description: 'Laptop accessories and stationery for home office',
      amount: 125.50,
      category: 'office-supplies',
      date: '2024-01-10',
      status: 'pending',
      submittedDate: '2024-01-11',
      receipts: ['supplies-receipt.pdf'],
      reimbursementDate: null
    },
    {
      id: '3',
      title: 'Team Lunch',
      description: 'Team building lunch with new team members',
      amount: 180.00,
      category: 'meals',
      date: '2024-01-08',
      status: 'approved',
      submittedDate: '2024-01-09',
      approvedDate: '2024-01-10',
      receipts: ['lunch-receipt.pdf'],
      reimbursementDate: '2024-01-12'
    },
    {
      id: '4',
      title: 'Conference Registration',
      description: 'React Conference 2024 registration fee',
      amount: 450.00,
      category: 'training',
      date: '2024-01-05',
      status: 'rejected',
      submittedDate: '2024-01-06',
      rejectedDate: '2024-01-08',
      rejectionReason: 'Conference not pre-approved',
      receipts: ['conference-receipt.pdf']
    },
    {
      id: '5',
      title: 'Taxi Fare',
      description: 'Transportation to client office',
      amount: 35.00,
      category: 'transportation',
      date: '2024-01-03',
      status: 'approved',
      submittedDate: '2024-01-04',
      approvedDate: '2024-01-05',
      receipts: ['taxi-receipt.pdf'],
      reimbursementDate: '2024-01-07'
    }
  ]);

  const filteredExpenses = expenses.filter(expense => {
    const statusMatch = filter === 'all' || expense.status === filter;
    
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'this-month':
          dateMatch = expenseDate.getMonth() === today.getMonth() && 
                     expenseDate.getFullYear() === today.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
          dateMatch = expenseDate.getMonth() === lastMonth.getMonth() && 
                     expenseDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this-year':
          dateMatch = expenseDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return statusMatch && dateMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reimbursed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'reimbursed':
        return <CheckCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel':
        return 'bg-orange-100 text-orange-800';
      case 'meals':
        return 'bg-green-100 text-green-800';
      case 'office-supplies':
        return 'bg-purple-100 text-purple-800';
      case 'training':
        return 'bg-orange-100 text-orange-800';
      case 'transportation':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredExpenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Expenses</h1>
          <p className="text-gray-600">Track and manage your expense claims</p>
        </div>
        <button
          onClick={() => navigate('/expenses/submit')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Submit Expense</span>
        </button>
      </div>

      {/* Expense Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{filteredExpenses.length} claims</p>
            </div>
            <Receipt className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">${approvedExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{filteredExpenses.filter(e => e.status === 'approved').length} claims</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${pendingExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{filteredExpenses.filter(e => e.status === 'pending').length} claims</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                ${filteredExpenses.filter(e => e.status === 'rejected').reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{filteredExpenses.filter(e => e.status === 'rejected').length} claims</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="reimbursed">Reimbursed</option>
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

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <div key={expense.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                    {getStatusIcon(expense.status)}
                    <span className="ml-1">{expense.status}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                    {expense.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{expense.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Expense Date: {new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Submitted: {new Date(expense.submittedDate).toLocaleDateString()}</span>
                  </div>
                  {expense.receipts && (
                    <div className="flex items-center space-x-1">
                      <Receipt className="h-4 w-4" />
                      <span>{expense.receipts.length} receipt(s)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{expense.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Status Details */}
            {expense.status === 'approved' && expense.reimbursementDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Approved:</strong> {new Date(expense.approvedDate).toLocaleDateString()} | 
                  <strong> Reimbursed:</strong> {new Date(expense.reimbursementDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {expense.status === 'rejected' && expense.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Rejected:</strong> {new Date(expense.rejectedDate).toLocaleDateString()} | 
                  <strong> Reason:</strong> {expense.rejectionReason}
                </p>
              </div>
            )}

            {expense.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Status:</strong> Pending approval - submitted {new Date(expense.submittedDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Receipts */}
            {expense.receipts && expense.receipts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Receipts</h4>
                <div className="flex flex-wrap gap-2">
                  {expense.receipts.map((receipt, index) => (
                    <button
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      {receipt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                ID: {expense.id}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                  View Details
                </button>
                {expense.status === 'pending' && (
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' && dateFilter === 'all'
              ? 'You haven\'t submitted any expense claims yet.' 
              : 'No expenses match the selected filters.'}
          </p>
          <button
            onClick={() => navigate('/expenses/submit')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Submit Your First Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default MyExpenses;