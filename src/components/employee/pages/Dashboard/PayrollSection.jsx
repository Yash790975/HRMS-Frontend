// import React from 'react';
// import { DollarSign, TrendingUp, Calendar, Download, Eye, CreditCard } from 'lucide-react';

// const PayrollSection = () => {
//   const payrollData = {
//     currentSalary: 75000,
//     nextPayDate: '2025-06-30',
//     ytdEarnings: 37500,
//     lastPayAmount: 3125,
//     taxesWithheld: 562.50,
//     netPay: 2562.50
//   };

//   const recentPayslips = [
//     {
//       id: 1,
//       period: 'June 2025',
//       payDate: '2025-06-15',
//       grossPay: 3125,
//       deductions: 562.50,
//       netPay: 2562.50,
//       status: 'Paid'
//     },
//     {
//       id: 2,
//       period: 'May 2025',
//       payDate: '2025-05-15',
//       grossPay: 3125,
//       deductions: 562.50,
//       netPay: 2562.50,
//       status: 'Paid'
//     },
//     {
//       id: 3,
//       period: 'April 2025',
//       payDate: '2025-04-15',
//       grossPay: 3125,
//       deductions: 562.50,
//       netPay: 2562.50,
//       status: 'Paid'
//     },
//     {
//       id: 4,
//       period: 'March 2025',
//       payDate: '2025-03-15',
//       grossPay: 3125,
//       deductions: 562.50,
//       netPay: 2562.50,
//       status: 'Paid'
//     }
//   ];

//   const benefits = [
//     { name: 'Health Insurance', contribution: 150, employer: 300 },
//     { name: '401(k)', contribution: 187.50, employer: 93.75 },
//     { name: 'Dental Insurance', contribution: 25, employer: 50 },
//     { name: 'Life Insurance', contribution: 12.50, employer: 25 }
//   ];

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Payroll & Compensation</h2>
//         <DollarSign className="h-5 w-5 text-orange-600" />
//       </div>

//       {/* Salary Overview */}
//       <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="font-semibold text-green-800">Annual Salary</h3>
//             <p className="text-2xl font-bold text-green-700">{formatCurrency(payrollData.currentSalary)}</p>
//             <p className="text-green-600 text-sm">Next pay: {new Date(payrollData.nextPayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-green-600">YTD Earnings</p>
//             <p className="text-xl font-bold text-green-700">{formatCurrency(payrollData.ytdEarnings)}</p>
//             <div className="flex items-center text-green-600 text-sm">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               <span>50% of annual</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pay Summary Cards */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-blue-50 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-blue-600">Last Pay</p>
//               <p className="text-lg font-bold text-blue-700">{formatCurrency(payrollData.lastPayAmount)}</p>
//             </div>
//             <CreditCard className="h-5 w-5 text-blue-600" />
//           </div>
//         </div>
        
//         <div className="bg-red-50 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-red-600">Taxes</p>
//               <p className="text-lg font-bold text-red-700">{formatCurrency(payrollData.taxesWithheld)}</p>
//             </div>
//             <div className="text-xs text-red-600">18%</div>
//           </div>
//         </div>
        
//         <div className="bg-green-50 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-green-600">Net Pay</p>
//               <p className="text-lg font-bold text-green-700">{formatCurrency(payrollData.netPay)}</p>
//             </div>
//             <div className="text-xs text-green-600">82%</div>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Overview */}
//       <div className="mb-6">
//         <h3 className="font-medium text-gray-900 mb-3">Benefits & Deductions</h3>
//         <div className="space-y-2">
//           {benefits.map((benefit, index) => (
//             <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
//               <span className="text-sm font-medium text-gray-900">{benefit.name}</span>
//               <div className="flex items-center space-x-4 text-sm">
//                 <span className="text-gray-600">You: {formatCurrency(benefit.contribution)}</span>
//                 <span className="text-green-600">Employer: {formatCurrency(benefit.employer)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Payslips */}
//       <div>
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="font-medium text-gray-900">Recent Payslips</h3>
//           <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
//             View All
//           </button>
//         </div>
        
//         <div className="space-y-2">
//           {recentPayslips.map((payslip) => (
//             <div key={payslip.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
//                   <Calendar className="h-4 w-4 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{payslip.period}</p>
//                   <p className="text-sm text-gray-600">Paid on {new Date(payslip.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="text-right">
//                   <p className="font-medium text-gray-900">{formatCurrency(payslip.netPay)}</p>
//                   <p className="text-sm text-gray-600">Net Pay</p>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <button className="p-1 text-gray-400 hover:text-blue-600" title="View Details">
//                     <Eye className="h-4 w-4" />
//                   </button>
//                   <button className="p-1 text-gray-400 hover:text-green-600" title="Download">
//                     <Download className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Tax Documents Link */}
//       <div className="mt-4 pt-4 border-t border-gray-200">
//         <button className="w-full text-center text-orange-600 hover:text-orange-700 text-sm font-medium">
//           Access Tax Documents & Forms →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PayrollSection;    
import React from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PayrollSection = () => {
  const navigate = useNavigate();
  
  // Mock payroll data based on MyPayroll.jsx structure
  const payrollData = {
    currentSalary: {
      basic: 5000,
      allowances: 1500,
      deductions: 800,
      netPay: 6200
    },
    lastPayslip: {
      month: 'January 2024',
      grossPay: 7200,
      totalDeductions: 800,
      netPay: 6400,
      tax: 600
    },
    yearlyEarnings: 72000
  };

  const recentPayslips = [
    {
      id: 1,
      period: 'January 2024',
      payDate: '2024-01-31',
      netPay: 6400,
      status: 'Paid'
    },
    {
      id: 2,
      period: 'December 2023', 
      payDate: '2023-12-31',
      netPay: 6750,
      status: 'Paid'
    },
    {
      id: 3,
      period: 'November 2023',
      payDate: '2023-11-30', 
      netPay: 5750,
      status: 'Paid'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Payroll & Compensation</h2>
        <DollarSign className="h-5 w-5 text-orange-600" />
      </div>

      {/* Salary Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Monthly Salary</h3>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(payrollData.currentSalary.basic)}</p>
            <p className="text-green-600 text-sm">Base salary</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600">Net Pay</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(payrollData.currentSalary.netPay)}</p>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>After deductions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Gross Pay</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(payrollData.lastPayslip.grossPay)}</p>
            </div>
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Deductions</p>
              <p className="text-lg font-bold text-red-700">{formatCurrency(payrollData.lastPayslip.totalDeductions)}</p>
            </div>
            <div className="text-xs text-red-600">
              {Math.round((payrollData.lastPayslip.totalDeductions / payrollData.lastPayslip.grossPay) * 100)}%
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Net Pay</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(payrollData.lastPayslip.netPay)}</p>
            </div>
            <div className="text-xs text-green-600">
              {Math.round((payrollData.lastPayslip.netPay / payrollData.lastPayslip.grossPay) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payslips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Recent Payslips</h3>
          <button 
            onClick={() => navigate('/payroll')}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {recentPayslips.map((payslip) => (
            <div key={payslip.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payslip.period}</p>
                  <p className="text-sm text-gray-600">Paid on {new Date(payslip.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(payslip.netPay)}</p>
                  <p className="text-sm text-gray-600">Net Pay</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600" title="Download">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YTD Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Year-to-Date Earnings</p>
            <p className="text-lg font-bold text-orange-600">{formatCurrency(payrollData.yearlyEarnings)}</p>
          </div>
          <button 
            onClick={() => navigate('/payroll')}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            View Payroll Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollSection;