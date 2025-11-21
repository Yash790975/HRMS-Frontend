import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Download, Plus, Search, Filter, Calculator } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const PayrollManagement = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const payrollData = getFromStorage('financePayrollRecords') || [];
    
    setEmployees(employeesData);
    setPayrollRecords(payrollData);

    // Generate sample payroll data if none exists
    if (payrollData.length === 0 && employeesData.length > 0) {
      generateSamplePayroll(employeesData);
    }
  };

  const generateSamplePayroll = (employeesData) => {
    const samplePayroll = employeesData.map((employee, index) => {
      const baseSalary = 50000 + (index * 10000);
      const hra = baseSalary * 0.4;
      const da = baseSalary * 0.1;
      const medicalAllowance = 5000;
      const transportAllowance = 3000;
      const grossSalary = baseSalary + hra + da + medicalAllowance + transportAllowance;
      
      const pf = baseSalary * 0.12;
      const esi = grossSalary * 0.0175;
      const professionalTax = 2500;
      const tds = grossSalary * 0.1;
      const totalDeductions = pf + esi + professionalTax + tds;
      
      const netSalary = grossSalary - totalDeductions;

      return {
        id: `PAY${Date.now()}${index}`,
        employeeId: employee.id,
        employeeName: employee.personalDetails?.fullName,
        employeeCode: employee.employmentDetails?.employeeId,
        department: employee.employmentDetails?.department,
        designation: employee.employmentDetails?.designation,
        month: selectedMonth,
        
        // Earnings
        baseSalary: baseSalary,
        hra: hra,
        da: da,
        medicalAllowance: medicalAllowance,
        transportAllowance: transportAllowance,
        overtime: Math.floor(Math.random() * 5000),
        bonus: index === 0 ? 10000 : 0,
        grossSalary: grossSalary,
        
        // Deductions
        pf: pf,
        esi: esi,
        professionalTax: professionalTax,
        tds: tds,
        loanDeduction: index === 1 ? 5000 : 0,
        totalDeductions: totalDeductions,
        
        netSalary: netSalary,
        status: 'Processed',
        processedDate: new Date().toISOString().split('T')[0],
        processedBy: 'Finance Team',
        paymentMethod: 'Bank Transfer',
        bankAccount: `****${Math.floor(Math.random() * 9999)}`,
        createdAt: new Date().toISOString()
      };
    });

    setPayrollRecords(samplePayroll);
    saveToStorage('financePayrollRecords', samplePayroll);
  };

  const currentMonthPayroll = payrollRecords.filter(record => record.month === selectedMonth);
  const totalPayroll = currentMonthPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const totalGross = currentMonthPayroll.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalDeductions = currentMonthPayroll.reduce((sum, record) => sum + record.totalDeductions, 0);
  const averageSalary = currentMonthPayroll.length > 0 ? totalPayroll / currentMonthPayroll.length : 0;

  const filteredPayroll = currentMonthPayroll.filter(record => {
    const matchesSearch = !searchTerm || 
      record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generatePayslip = (record) => {
    // Simulate payslip generation
    alert(`Payslip generated for ${record.employeeName} - ${record.month}`);
  };

  const AddPayrollModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      baseSalary: '',
      hra: '',
      da: '',
      medicalAllowance: '',
      transportAllowance: '',
      overtime: '',
      bonus: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      
      const baseSalary = parseFloat(formData.baseSalary);
      const hra = parseFloat(formData.hra) || 0;
      const da = parseFloat(formData.da) || 0;
      const medicalAllowance = parseFloat(formData.medicalAllowance) || 0;
      const transportAllowance = parseFloat(formData.transportAllowance) || 0;
      const overtime = parseFloat(formData.overtime) || 0;
      const bonus = parseFloat(formData.bonus) || 0;
      
      const grossSalary = baseSalary + hra + da + medicalAllowance + transportAllowance + overtime + bonus;
      const pf = baseSalary * 0.12;
      const esi = grossSalary * 0.0175;
      const professionalTax = 2500;
      const tds = grossSalary * 0.1;
      const totalDeductions = pf + esi + professionalTax + tds;
      const netSalary = grossSalary - totalDeductions;

      const newPayroll = {
        id: `PAY${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        employeeCode: selectedEmployee?.employmentDetails?.employeeId,
        department: selectedEmployee?.employmentDetails?.department,
        designation: selectedEmployee?.employmentDetails?.designation,
        month: selectedMonth,
        baseSalary,
        hra,
        da,
        medicalAllowance,
        transportAllowance,
        overtime,
        bonus,
        grossSalary,
        pf,
        esi,
        professionalTax,
        tds,
        loanDeduction: 0,
        totalDeductions,
        netSalary,
        status: 'Processed',
        processedDate: new Date().toISOString().split('T')[0],
        processedBy: 'Finance Team',
        paymentMethod: 'Bank Transfer',
        bankAccount: `****${Math.floor(Math.random() * 9999)}`,
        createdAt: new Date().toISOString()
      };

      const updatedPayroll = [...payrollRecords, newPayroll];
      setPayrollRecords(updatedPayroll);
      saveToStorage('financePayrollRecords', updatedPayroll);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        baseSalary: '',
        hra: '',
        da: '',
        medicalAllowance: '',
        transportAllowance: '',
        overtime: '',
        bonus: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Payroll Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Base Salary"
                value={formData.baseSalary}
                onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="number"
                placeholder="HRA"
                value={formData.hra}
                onChange={(e) => setFormData({...formData, hra: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="DA"
                value={formData.da}
                onChange={(e) => setFormData({...formData, da: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Medical Allowance"
                value={formData.medicalAllowance}
                onChange={(e) => setFormData({...formData, medicalAllowance: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Transport Allowance"
                value={formData.transportAllowance}
                onChange={(e) => setFormData({...formData, transportAllowance: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Overtime"
                value={formData.overtime}
                onChange={(e) => setFormData({...formData, overtime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Bonus"
                value={formData.bonus}
                onChange={(e) => setFormData({...formData, bonus: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add Payroll
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
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Process and manage employee payroll</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payroll
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
              <p className="text-gray-600 text-sm">Net Payroll</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGross)}</p>
              <p className="text-gray-600 text-sm">Gross Payroll</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
              <p className="text-gray-600 text-sm">Total Deductions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageSalary)}</p>
              <p className="text-gray-600 text-sm">Average Salary</p>
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Payroll
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Payroll for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
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
              {filteredPayroll.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No payroll records found</p>
                    <p className="text-sm">Select a different month or add payroll records</p>
                  </td>
                </tr>
              ) : (
                filteredPayroll.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employeeCode} • {record.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(record.grossSalary)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Base: {formatCurrency(record.baseSalary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(record.totalDeductions)}
                      </div>
                      <div className="text-sm text-gray-500">
                        PF: {formatCurrency(record.pf)} | TDS: {formatCurrency(record.tds)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(record.netSalary)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => generatePayslip(record)}
                        className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-lg hover:bg-orange-200"
                      >
                        Generate Payslip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddPayrollModal />
    </div>
  );
};

export default PayrollManagement;