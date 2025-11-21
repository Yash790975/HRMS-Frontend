import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Download, Plus, Search, Filter } from 'lucide-react';
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
    const payrollData = getFromStorage('payrollRecords') || [];
    
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
      const grossSalary = baseSalary + hra + da;
      const pf = baseSalary * 0.12;
      const tax = grossSalary * 0.1;
      const netSalary = grossSalary - pf - tax;

      return {
        id: `PAY${Date.now()}${index}`,
        employeeId: employee.id,
        employeeName: employee.personalDetails?.fullName,
        month: selectedMonth,
        baseSalary: baseSalary,
        hra: hra,
        da: da,
        grossSalary: grossSalary,
        pf: pf,
        tax: tax,
        netSalary: netSalary,
        status: 'Processed',
        processedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
    });

    setPayrollRecords(samplePayroll);
    saveToStorage('payrollRecords', samplePayroll);
  };

  const currentMonthPayroll = payrollRecords.filter(record => record.month === selectedMonth);
  const totalPayroll = currentMonthPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const averageSalary = currentMonthPayroll.length > 0 ? totalPayroll / currentMonthPayroll.length : 0;

  const filteredPayroll = currentMonthPayroll.filter(record => {
    const matchesSearch = !searchTerm || 
      record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const AddPayrollModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      baseSalary: '',
      hra: '',
      da: '',
      pf: '',
      tax: ''
    });

    const calculateSalary = () => {
      const base = parseFloat(formData.baseSalary) || 0;
      const hra = parseFloat(formData.hra) || 0;
      const da = parseFloat(formData.da) || 0;
      const pf = parseFloat(formData.pf) || 0;
      const tax = parseFloat(formData.tax) || 0;
      
      const gross = base + hra + da;
      const net = gross - pf - tax;
      
      return { gross, net };
    };

    const { gross, net } = calculateSalary();

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

      const newPayroll = {
        id: `PAY${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        month: selectedMonth,
        baseSalary: parseFloat(formData.baseSalary),
        hra: parseFloat(formData.hra),
        da: parseFloat(formData.da),
        grossSalary: gross,
        pf: parseFloat(formData.pf),
        tax: parseFloat(formData.tax),
        netSalary: net,
        status: 'Processed',
        processedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      const updatedPayroll = [...payrollRecords, newPayroll];
      setPayrollRecords(updatedPayroll);
      saveToStorage('payrollRecords', updatedPayroll);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        baseSalary: '',
        hra: '',
        da: '',
        pf: '',
        tax: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                  {emp.personalDetails?.fullName}
                </option>
              ))}
            </select>
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
              required
            />
            <input
              type="number"
              placeholder="DA"
              value={formData.da}
              onChange={(e) => setFormData({...formData, da: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="number"
              placeholder="PF Deduction"
              value={formData.pf}
              onChange={(e) => setFormData({...formData, pf: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="number"
              placeholder="Tax Deduction"
              value={formData.tax}
              onChange={(e) => setFormData({...formData, tax: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            
            {/* Calculated Values */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Gross Salary: {formatCurrency(gross)}</p>
              <p className="text-sm text-gray-600">Net Salary: {formatCurrency(net)}</p>
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
          <p className="text-gray-600 mt-1">Manage employee salaries and payroll processing</p>
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
              <p className="text-gray-600 text-sm">Total Payroll</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{currentMonthPayroll.length}</p>
              <p className="text-gray-600 text-sm">Employees Paid</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageSalary)}</p>
              <p className="text-gray-600 text-sm">Average Salary</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-gray-600 text-sm">Processing Rate</p>
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
                  Base Salary
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
                      <div className="text-sm font-medium text-gray-900">
                        {record.employeeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Processed: {formatDate(record.processedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(record.baseSalary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(record.grossSalary)}
                      </div>
                      <div className="text-sm text-gray-500">
                        HRA: {formatCurrency(record.hra)} | DA: {formatCurrency(record.da)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(record.pf + record.tax)}
                      </div>
                      <div className="text-sm text-gray-500">
                        PF: {formatCurrency(record.pf)} | Tax: {formatCurrency(record.tax)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(record.netSalary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {record.status}
                      </span>
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