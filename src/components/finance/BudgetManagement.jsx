import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, AlertTriangle, Plus, Search, DollarSign, Target } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = ['Information Technology', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Operations'];
  const budgetCategories = ['Personnel', 'Technology', 'Marketing', 'Operations', 'Training', 'Travel', 'Office Expenses'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const budgetData = getFromStorage('financeBudgets') || [];
    setBudgets(budgetData);

    // Generate sample budget data if none exists
    if (budgetData.length === 0) {
      generateSampleBudgets();
    }
  };

  const generateSampleBudgets = () => {
    const sampleBudgets = [
      {
        id: 'BUD001',
        department: 'Information Technology',
        category: 'Technology',
        budgetName: 'IT Infrastructure',
        year: selectedYear,
        allocatedAmount: 5000000,
        spentAmount: 3200000,
        remainingAmount: 1800000,
        status: 'Active',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        approvedBy: 'CFO',
        approvedDate: `${selectedYear}-01-01`,
        lastUpdated: '2024-03-10',
        variance: -200000,
        utilizationPercentage: 64
      },
      {
        id: 'BUD002',
        department: 'Marketing',
        category: 'Marketing',
        budgetName: 'Digital Marketing Campaign',
        year: selectedYear,
        allocatedAmount: 2500000,
        spentAmount: 2100000,
        remainingAmount: 400000,
        status: 'Active',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        approvedBy: 'CFO',
        approvedDate: `${selectedYear}-01-01`,
        lastUpdated: '2024-03-08',
        variance: 100000,
        utilizationPercentage: 84
      },
      {
        id: 'BUD003',
        department: 'Human Resources',
        category: 'Personnel',
        budgetName: 'Recruitment & Training',
        year: selectedYear,
        allocatedAmount: 1500000,
        spentAmount: 950000,
        remainingAmount: 550000,
        status: 'Active',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        approvedBy: 'CFO',
        approvedDate: `${selectedYear}-01-01`,
        lastUpdated: '2024-03-05',
        variance: 50000,
        utilizationPercentage: 63
      },
      {
        id: 'BUD004',
        department: 'Sales',
        category: 'Travel',
        budgetName: 'Sales Travel & Entertainment',
        year: selectedYear,
        allocatedAmount: 800000,
        spentAmount: 720000,
        remainingAmount: 80000,
        status: 'Active',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        approvedBy: 'CFO',
        approvedDate: `${selectedYear}-01-01`,
        lastUpdated: '2024-03-12',
        variance: -20000,
        utilizationPercentage: 90
      },
      {
        id: 'BUD005',
        department: 'Operations',
        category: 'Operations',
        budgetName: 'Facility Management',
        year: selectedYear,
        allocatedAmount: 1200000,
        spentAmount: 600000,
        remainingAmount: 600000,
        status: 'Active',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        approvedBy: 'CFO',
        approvedDate: `${selectedYear}-01-01`,
        lastUpdated: '2024-03-01',
        variance: 0,
        utilizationPercentage: 50
      }
    ];

    setBudgets(sampleBudgets);
    saveToStorage('financeBudgets', sampleBudgets);
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = !searchTerm || 
      budget.budgetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = budget.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  const totalAllocated = filteredBudgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const totalSpent = filteredBudgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const totalRemaining = filteredBudgets.reduce((sum, budget) => sum + budget.remainingAmount, 0);
  const overBudgetCount = filteredBudgets.filter(budget => budget.spentAmount > budget.allocatedAmount).length;

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
      case 'Draft': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const AddBudgetModal = () => {
    const [formData, setFormData] = useState({
      department: '',
      category: '',
      budgetName: '',
      allocatedAmount: '',
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      const newBudget = {
        id: `BUD${String(budgets.length + 1).padStart(3, '0')}`,
        department: formData.department,
        category: formData.category,
        budgetName: formData.budgetName,
        year: selectedYear,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        spentAmount: 0,
        remainingAmount: parseFloat(formData.allocatedAmount),
        status: 'Active',
        startDate: formData.startDate,
        endDate: formData.endDate,
        approvedBy: 'CFO',
        approvedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        variance: 0,
        utilizationPercentage: 0
      };

      const updatedBudgets = [...budgets, newBudget];
      setBudgets(updatedBudgets);
      saveToStorage('financeBudgets', updatedBudgets);
      setShowAddModal(false);
      setFormData({
        department: '',
        category: '',
        budgetName: '',
        allocatedAmount: '',
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Create New Budget</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Category</option>
              {budgetCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Budget Name"
              value={formData.budgetName}
              onChange={(e) => setFormData({...formData, budgetName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="number"
              placeholder="Allocated Amount"
              value={formData.allocatedAmount}
              onChange={(e) => setFormData({...formData, allocatedAmount: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Create Budget
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
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-1">Track and manage departmental budgets</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAllocated)}</p>
              <p className="text-gray-600 text-sm">Total Allocated</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              <p className="text-gray-600 text-sm">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
              <p className="text-gray-600 text-sm">Remaining</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{overBudgetCount}</p>
              <p className="text-gray-600 text-sm">Over Budget</p>
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
                placeholder="Search budgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Budget Overview - {selectedYear}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No budgets found</p>
                    <p className="text-sm">Create a new budget to get started</p>
                  </td>
                </tr>
              ) : (
                filteredBudgets.map((budget) => (
                  <tr key={budget.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{budget.budgetName}</div>
                        <div className="text-sm text-gray-500">{budget.department} • {budget.category}</div>
                        <div className="text-sm text-gray-500">
                          {budget.startDate} to {budget.endDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(budget.allocatedAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(budget.spentAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Remaining: {formatCurrency(budget.remainingAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getUtilizationColor(budget.utilizationPercentage)}`}
                            style={{ width: `${Math.min(budget.utilizationPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{budget.utilizationPercentage}%</span>
                      </div>
                      {budget.variance !== 0 && (
                        <div className={`text-sm ${budget.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Variance: {formatCurrency(Math.abs(budget.variance))} {budget.variance > 0 ? 'under' : 'over'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                        {budget.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddBudgetModal />
    </div>
  );
};

export default BudgetManagement;