import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, PieChart, FileText, Target } from 'lucide-react';
import { getFromStorage } from '../../utils/localStorage';

const FinancialReporting = () => {
  const [reportData, setReportData] = useState({
    payroll: [],
    expenses: [],
    budgets: [],
    invoices: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    const payroll = getFromStorage('financePayrollRecords') || [];
    const expenses = getFromStorage('financeExpenseRecords') || [];
    const budgets = getFromStorage('financeBudgets') || [];
    const invoices = getFromStorage('financeInvoices') || [];

    setReportData({ payroll, expenses, budgets, invoices });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate financial metrics
  const totalPayrollCost = reportData.payroll.reduce((sum, record) => sum + record.netSalary, 0);
  const totalExpenses = reportData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudgetAllocated = reportData.budgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const totalBudgetSpent = reportData.budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const totalInvoicesAmount = reportData.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  // Department-wise expense breakdown
  const expensesByDepartment = reportData.expenses.reduce((acc, expense) => {
    const dept = expense.department || 'Other';
    acc[dept] = (acc[dept] || 0) + expense.amount;
    return acc;
  }, {});

  // Monthly expense trend
  const monthlyExpenses = reportData.expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Budget utilization by department
  const budgetUtilization = reportData.budgets.map(budget => ({
    department: budget.department,
    allocated: budget.allocatedAmount,
    spent: budget.spentAmount,
    utilization: Math.round((budget.spentAmount / budget.allocatedAmount) * 100)
  }));

  const generateReport = (reportType) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      reportType,
      period: selectedPeriod,
      year: selectedYear,
      data: {}
    };

    switch (reportType) {
      case 'payroll':
        reportData.data = {
          summary: {
            totalPayroll: totalPayrollCost,
            employeeCount: reportData.payroll.length,
            averageSalary: totalPayrollCost / reportData.payroll.length || 0
          },
          details: reportData.payroll
        };
        break;
      case 'expenses':
        reportData.data = {
          summary: {
            totalExpenses,
            byDepartment: expensesByDepartment,
            monthlyTrend: monthlyExpenses
          },
          details: reportData.expenses
        };
        break;
      case 'budget':
        reportData.data = {
          summary: {
            totalAllocated: totalBudgetAllocated,
            totalSpent: totalBudgetSpent,
            utilization: budgetUtilization
          },
          details: reportData.budgets
        };
        break;
      case 'financial':
        reportData.data = {
          summary: {
            payrollCost: totalPayrollCost,
            operationalExpenses: totalExpenses,
            budgetUtilization: (totalBudgetSpent / totalBudgetAllocated) * 100,
            accountsPayable: totalInvoicesAmount
          }
        };
        break;
    }

    // Simulate download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const MetricCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data, type = 'bar' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{key}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((value / Math.max(...Object.values(data))) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-20 text-right">
                {typeof value === 'number' ? formatCurrency(value) : value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reporting & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial insights and reports</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Payroll Cost"
          value={formatCurrency(totalPayrollCost)}
          icon={DollarSign}
          color="from-blue-600 to-blue-700"
          change={{ type: 'positive', value: '+8.2%' }}
        />
        <MetricCard
          title="Operational Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingUp}
          color="from-amber-600 to-amber-700"
          change={{ type: 'negative', value: '-3.1%' }}
        />
        <MetricCard
          title="Budget Utilization"
          value={`${Math.round((totalBudgetSpent / totalBudgetAllocated) * 100)}%`}
          icon={Target}
          color="from-green-600 to-green-700"
          change={{ type: 'positive', value: '+5.7%' }}
        />
        <MetricCard
          title="Accounts Payable"
          value={formatCurrency(totalInvoicesAmount)}
          icon={FileText}
          color="from-purple-600 to-purple-700"
          change={{ type: 'negative', value: '-12.4%' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Expenses by Department" data={expensesByDepartment} />
        <ChartCard title="Monthly Expense Trend" data={monthlyExpenses} />
      </div>

      {/* Budget Utilization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization by Department</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
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
              {budgetUtilization.map((budget, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{budget.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(budget.allocated)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(budget.spent)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            budget.utilization >= 90 ? 'bg-red-500' : 
                            budget.utilization >= 75 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${budget.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{budget.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      budget.utilization >= 90 ? 'bg-red-100 text-red-800' : 
                      budget.utilization >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {budget.utilization >= 90 ? 'Over Budget' : budget.utilization >= 75 ? 'Near Limit' : 'On Track'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => generateReport('payroll')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Payroll Report</p>
              <p className="text-xs text-gray-500">Download payroll data</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('expenses')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Expense Report</p>
              <p className="text-xs text-gray-500">Download expense analysis</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('budget')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <div className="text-center">
              <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Budget Report</p>
              <p className="text-xs text-gray-500">Download budget analysis</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('financial')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Financial Summary</p>
              <p className="text-xs text-gray-500">Download complete report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
          Key Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Payroll Efficiency</h4>
            <p className="text-sm text-blue-700">
              Payroll costs represent {Math.round((totalPayrollCost / (totalPayrollCost + totalExpenses)) * 100)}% of total operational expenses.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Budget Performance</h4>
            <p className="text-sm text-amber-700">
              Overall budget utilization is at {Math.round((totalBudgetSpent / totalBudgetAllocated) * 100)}% with {formatCurrency(totalBudgetAllocated - totalBudgetSpent)} remaining.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Cost Control</h4>
            <p className="text-sm text-green-700">
              Expense management shows effective cost control with departmental spending within allocated budgets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReporting;