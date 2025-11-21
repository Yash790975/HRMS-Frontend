import React from 'react';
import { DollarSign, TrendingUp, Receipt, Users, PieChart, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const FinanceDashboard = () => {
  const stats = [
    {
      title: 'Monthly Payroll',
      value: '₹84.2L',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange'
    },
    {
      title: 'Pending Expenses',
      value: '₹12.5L',
      change: '-15%',
      changeType: 'negative',
      icon: Receipt,
      color: 'amber'
    },
    {
      title: 'Budget Utilization',
      value: '78%',
      change: '+5%',
      changeType: 'positive',
      icon: PieChart,
      color: 'emerald'
    },
    {
      title: 'Outstanding Payables',
      value: '₹25.8L',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'Payroll',
      description: 'Monthly salary processing',
      amount: '₹84.2L',
      status: 'Completed',
      date: '2024-03-01'
    },
    {
      id: 2,
      type: 'Expense',
      description: 'Travel reimbursement - John Doe',
      amount: '₹15,000',
      status: 'Pending',
      date: '2024-03-10'
    },
    {
      id: 3,
      type: 'Vendor Payment',
      description: 'Office supplies - ABC Corp',
      amount: '₹45,000',
      status: 'Approved',
      date: '2024-03-08'
    },
    {
      id: 4,
      type: 'Tax Payment',
      description: 'TDS remittance',
      amount: '₹2.5L',
      status: 'Completed',
      date: '2024-03-05'
    }
  ];

  const pendingApprovals = [
    { id: 1, type: 'Expense Claim', employee: 'Sarah Wilson', amount: '₹8,500', priority: 'High' },
    { id: 2, type: 'Budget Revision', department: 'Marketing', amount: '₹2.5L', priority: 'Medium' },
    { id: 3, type: 'Vendor Payment', vendor: 'Tech Solutions', amount: '₹75,000', priority: 'High' },
    { id: 4, type: 'Salary Increment', employee: 'Mike Johnson', amount: '₹15,000', priority: 'Low' }
  ];

  const colorClasses = {
    orange: 'from-orange-600 to-orange-700',
    amber: 'from-amber-600 to-amber-700',
    emerald: 'from-emerald-600 to-emerald-700',
    blue: 'from-blue-600 to-blue-700'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Finance Portal! 💰</h1>
        <p className="text-orange-100">Manage financial operations and maintain fiscal health of the organization.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{transaction.type} • {transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{transaction.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{approval.type}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {approval.employee || approval.department || approval.vendor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{approval.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left">
            <DollarSign className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Process Payroll</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
            <Receipt className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Review Expenses</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-left">
            <PieChart className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Budget Analysis</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Vendor Payments</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;