import React, { useState, useEffect } from 'react';
import { DollarSign, User, Check, X, Calendar, Receipt, Filter, Search } from 'lucide-react';

const ExpenseApproval = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    // Load expenses from localStorage
    const loadExpenses = () => {
      const savedExpenses = JSON.parse(localStorage.getItem('hrms_expenses') || '[]');
      if (savedExpenses.length === 0) {
        // Add sample data
        const sampleExpenses = [
          {
            id: 1,
            employeeName: 'John Doe',
            employeeId: 'EMP001',
            category: 'Travel',
            amount: 245.50,
            description: 'Client meeting travel expenses',
            date: '2024-01-15',
            status: 'pending',
            submittedOn: '2024-01-16',
            receipts: ['receipt1.pdf', 'receipt2.pdf']
          },
          {
            id: 2,
            employeeName: 'Sarah Smith',
            employeeId: 'EMP002',
            category: 'Office Supplies',
            amount: 89.99,
            description: 'Stationery and office materials',
            date: '2024-01-14',
            status: 'approved',
            submittedOn: '2024-01-15',
            receipts: ['receipt3.pdf']
          },
          {
            id: 3,
            employeeName: 'Mike Johnson',
            employeeId: 'EMP003',
            category: 'Meals',
            amount: 125.00,
            description: 'Business lunch with client',
            date: '2024-01-13',
            status: 'pending',
            submittedOn: '2024-01-14',
            receipts: ['receipt4.pdf']
          },
          {
            id: 4,
            employeeName: 'Emily Davis',
            employeeId: 'EMP004',
            category: 'Training',
            amount: 500.00,
            description: 'Online course certification',
            date: '2024-01-12',
            status: 'rejected',
            submittedOn: '2024-01-13',
            receipts: ['receipt5.pdf'],
            managerComments: 'Training not pre-approved'
          }
        ];
        localStorage.setItem('hrms_expenses', JSON.stringify(sampleExpenses));
        setExpenses(sampleExpenses);
      } else {
        setExpenses(savedExpenses);
      }
    };

    loadExpenses();
  }, []);

  useEffect(() => {
    // Filter expenses based on search and status
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, statusFilter]);

  const handleApproval = (expenseId, action, comments = '') => {
    const updatedExpenses = expenses.map(expense => {
      if (expense.id === expenseId) {
        return {
          ...expense,
          status: action,
          managerComments: comments,
          approvedOn: new Date().toISOString().split('T')[0]
        };
      }
      return expense;
    });

    setExpenses(updatedExpenses);
    localStorage.setItem('hrms_expenses', JSON.stringify(updatedExpenses));
    setSelectedExpense(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Travel':
        return 'bg-blue-100 text-blue-800';
      case 'Office Supplies':
        return 'bg-purple-100 text-purple-800';
      case 'Meals':
        return 'bg-orange-100 text-orange-800';
      case 'Training':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ExpenseDetailModal = ({ expense, onClose, onApprove, onReject }) => {
    const [comments, setComments] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Details</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee:</span>
              <span className="font-medium">{expense.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-green-600">${expense.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{expense.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">{expense.submittedOn}</span>
            </div>
            <div>
              <span className="text-gray-600">Description:</span>
              <p className="font-medium mt-1">{expense.description}</p>
            </div>
            <div>
              <span className="text-gray-600">Receipts:</span>
              <div className="mt-1 space-y-1">
                {expense.receipts.map((receipt, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {receipt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="3"
              placeholder="Add comments..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onApprove(expense.id, 'approved', comments)}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onReject(expense.id, 'rejected', comments)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalPendingAmount = filteredExpenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Expense Approval</h1>
        <p className="text-orange-100">Review and approve expense claims from your team members</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
            </div>
            <Receipt className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPendingAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Claims</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredExpenses.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredExpenses.length} expenses</span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{expense.employeeName}</div>
                        <div className="text-sm text-gray-500">{expense.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${expense.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{expense.date}</div>
                    <div className="text-sm text-gray-500">Submitted: {expense.submittedOn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      View Details
                    </button>
                    {expense.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleApproval(expense.id, 'approved')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(expense.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onApprove={handleApproval}
          onReject={handleApproval}
        />
      )}
    </div>
  );
};

export default ExpenseApproval;