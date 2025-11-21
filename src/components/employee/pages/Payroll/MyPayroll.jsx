import React, { useState } from 'react';
import { DollarSign, Download, Eye, Calendar, TrendingUp, Filter } from 'lucide-react';

const MyPayroll = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Mock payroll data
  const payrollData = {
    currentSalary: {
      basic: 5000,
      allowances: 1500,
      bonus: 500,
      deductions: 800,
      netPay: 6200
    },
    payslips: [
      {
        id: '1',
        month: 'January 2024',
        date: '2024-01-31',
        basic: 5000,
        allowances: 1500,
        overtime: 200,
        bonus: 500,
        grossPay: 7200,
        tax: 600,
        insurance: 150,
        retirement: 50,
        totalDeductions: 800,
        netPay: 6400,
        status: 'paid'
      },
      {
        id: '2',
        month: 'December 2023',
        date: '2023-12-31',
        basic: 5000,
        allowances: 1500,
        overtime: 100,
        bonus: 1000,
        grossPay: 7600,
        tax: 650,
        insurance: 150,
        retirement: 50,
        totalDeductions: 850,
        netPay: 6750,
        status: 'paid'
      },
      {
        id: '3',
        month: 'November 2023',
        date: '2023-11-30',
        basic: 5000,
        allowances: 1500,
        overtime: 0,
        bonus: 0,
        grossPay: 6500,
        tax: 550,
        insurance: 150,
        retirement: 50,
        totalDeductions: 750,
        netPay: 5750,
        status: 'paid'
      }
    ],
    taxDocuments: [
      {
        id: '1',
        name: 'W-2 Form 2023',
        year: 2023,
        type: 'W-2',
        date: '2024-01-31',
        status: 'available'
      },
      {
        id: '2',
        name: '1099 Form 2023',
        year: 2023,
        type: '1099',
        date: '2024-01-31',
        status: 'available'
      }
    ]
  };

  const currentPayslip = payrollData.payslips[0];
  const yearlyEarnings = payrollData.payslips
    .filter(p => new Date(p.date).getFullYear() === selectedYear)
    .reduce((total, p) => total + p.netPay, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Payroll</h1>
        <p className="text-gray-600">View your salary information and payslips</p>
      </div>

      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Salary</p>
              <p className="text-2xl font-bold text-orange-600">${payrollData.currentSalary.basic.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Base salary</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Allowances</p>
              <p className="text-2xl font-bold text-green-600">${payrollData.currentSalary.allowances.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Monthly allowances</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-red-600">${payrollData.currentSalary.deductions.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total deductions</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-purple-600">${payrollData.currentSalary.netPay.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Take home</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Current Payslip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Latest Payslip - {currentPayslip.month}</h2>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentPayslip.status)}`}>
                {currentPayslip.status}
              </span>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2 text-sm">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Earnings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">${currentPayslip.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allowances</span>
                  <span className="font-medium">${currentPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime</span>
                  <span className="font-medium">${currentPayslip.overtime.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus</span>
                  <span className="font-medium">${currentPayslip.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Gross Pay</span>
                  <span className="font-bold text-green-600">${currentPayslip.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Income Tax</span>
                  <span className="font-medium">${currentPayslip.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Insurance</span>
                  <span className="font-medium">${currentPayslip.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retirement Fund</span>
                  <span className="font-medium">${currentPayslip.retirement.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Deductions</span>
                  <span className="font-bold text-red-600">${currentPayslip.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Net Pay</span>
                  <span className="font-bold text-orange-600 text-lg">${currentPayslip.netPay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payslip History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Payslip History</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
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
              {payrollData.payslips
                .filter(payslip => new Date(payslip.date).getFullYear() === selectedYear)
                .map((payslip) => (
                <tr key={payslip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payslip.month}</div>
                      <div className="text-sm text-gray-500">{new Date(payslip.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">${payslip.grossPay.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-red-600">${payslip.totalDeductions.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-600">${payslip.netPay.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payslip.status)}`}>
                      {payslip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-orange-600 hover:text-orange-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tax Documents</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payrollData.taxDocuments.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-600">Year: {doc.year}</p>
                    <p className="text-sm text-gray-500">Available since: {new Date(doc.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <button className="text-orange-600 hover:text-orange-900">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Yearly Summary ({selectedYear})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">${yearlyEarnings.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Monthly</p>
            <p className="text-2xl font-bold text-orange-600">${Math.round(yearlyEarnings / 12).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Payslips</p>
            <p className="text-2xl font-bold text-purple-600">
              {payrollData.payslips.filter(p => new Date(p.date).getFullYear() === selectedYear).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayroll;