import React, { useState, useEffect } from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle, Download, Plus, Shield } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const ComplianceTaxation = () => {
  const [taxRecords, setTaxRecords] = useState([]);
  const [complianceItems, setComplianceItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const taxTypes = ['TDS', 'PF', 'ESI', 'Professional Tax', 'GST', 'Income Tax'];
  const complianceTypes = ['Monthly Return', 'Quarterly Return', 'Annual Return', 'Audit', 'Registration'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const taxData = getFromStorage('financeTaxRecords') || [];
    const complianceData = getFromStorage('financeComplianceItems') || [];
    
    setEmployees(employeesData);
    setTaxRecords(taxData);
    setComplianceItems(complianceData);

    // Generate sample data if none exists
    if (taxData.length === 0) {
      generateSampleTaxRecords();
    }
    if (complianceData.length === 0) {
      generateSampleComplianceItems();
    }
  };

  const generateSampleTaxRecords = () => {
    const sampleTaxRecords = [
      {
        id: 'TAX001',
        taxType: 'TDS',
        description: 'TDS on Salary - March 2024',
        amount: 125000,
        dueDate: '2024-04-07',
        status: 'Paid',
        paidDate: '2024-04-05',
        challanNumber: 'TDS240405001',
        assessmentYear: '2024-25',
        filingDate: '2024-04-05',
        remarks: 'Monthly TDS payment for March 2024'
      },
      {
        id: 'TAX002',
        taxType: 'PF',
        description: 'PF Contribution - March 2024',
        amount: 85000,
        dueDate: '2024-04-15',
        status: 'Pending',
        paidDate: null,
        challanNumber: null,
        assessmentYear: '2024-25',
        filingDate: null,
        remarks: 'Monthly PF contribution'
      },
      {
        id: 'TAX003',
        taxType: 'ESI',
        description: 'ESI Contribution - March 2024',
        amount: 15000,
        dueDate: '2024-04-21',
        status: 'Pending',
        paidDate: null,
        challanNumber: null,
        assessmentYear: '2024-25',
        filingDate: null,
        remarks: 'Monthly ESI contribution'
      },
      {
        id: 'TAX004',
        taxType: 'Professional Tax',
        description: 'Professional Tax - March 2024',
        amount: 12500,
        dueDate: '2024-04-30',
        status: 'Overdue',
        paidDate: null,
        challanNumber: null,
        assessmentYear: '2024-25',
        filingDate: null,
        remarks: 'Monthly professional tax'
      },
      {
        id: 'TAX005',
        taxType: 'GST',
        description: 'GST Return - March 2024',
        amount: 45000,
        dueDate: '2024-04-20',
        status: 'Filed',
        paidDate: '2024-04-18',
        challanNumber: 'GST240418001',
        assessmentYear: '2024-25',
        filingDate: '2024-04-18',
        remarks: 'Monthly GST return filing'
      }
    ];

    setTaxRecords(sampleTaxRecords);
    saveToStorage('financeTaxRecords', sampleTaxRecords);
  };

  const generateSampleComplianceItems = () => {
    const sampleComplianceItems = [
      {
        id: 'COMP001',
        title: 'Annual Income Tax Return',
        type: 'Annual Return',
        description: 'File annual income tax return for AY 2024-25',
        dueDate: '2024-07-31',
        status: 'Pending',
        priority: 'High',
        assignedTo: 'Tax Consultant',
        completedDate: null,
        documents: ['Form 16', 'Investment Proofs', 'Bank Statements'],
        remarks: 'Collect all investment proofs from employees'
      },
      {
        id: 'COMP002',
        title: 'PF Annual Return',
        type: 'Annual Return',
        description: 'Submit PF annual return for FY 2023-24',
        dueDate: '2024-05-31',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'Finance Team',
        completedDate: null,
        documents: ['PF Statements', 'Employee Details'],
        remarks: 'Data compilation in progress'
      },
      {
        id: 'COMP003',
        title: 'GST Audit',
        type: 'Audit',
        description: 'Annual GST audit for FY 2023-24',
        dueDate: '2024-12-31',
        status: 'Completed',
        priority: 'Medium',
        assignedTo: 'External Auditor',
        completedDate: '2024-03-15',
        documents: ['GST Returns', 'Purchase Records', 'Sales Records'],
        remarks: 'Audit completed successfully'
      },
      {
        id: 'COMP004',
        title: 'TDS Quarterly Return',
        type: 'Quarterly Return',
        description: 'Q4 TDS return for FY 2023-24',
        dueDate: '2024-05-31',
        status: 'Pending',
        priority: 'High',
        assignedTo: 'Finance Team',
        completedDate: null,
        documents: ['TDS Certificates', 'Salary Records'],
        remarks: 'Prepare quarterly TDS return'
      }
    ];

    setComplianceItems(sampleComplianceItems);
    saveToStorage('financeComplianceItems', sampleComplianceItems);
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
      case 'Paid':
      case 'Filed':
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleMarkAsPaid = (taxId) => {
    const updatedTaxRecords = taxRecords.map(record =>
      record.id === taxId
        ? { 
            ...record, 
            status: 'Paid', 
            paidDate: new Date().toISOString().split('T')[0],
            challanNumber: `CHL${Date.now()}`
          }
        : record
    );
    setTaxRecords(updatedTaxRecords);
    saveToStorage('financeTaxRecords', updatedTaxRecords);
  };

  const handleCompleteCompliance = (complianceId) => {
    const updatedComplianceItems = complianceItems.map(item =>
      item.id === complianceId
        ? { 
            ...item, 
            status: 'Completed', 
            completedDate: new Date().toISOString().split('T')[0]
          }
        : item
    );
    setComplianceItems(updatedComplianceItems);
    saveToStorage('financeComplianceItems', updatedComplianceItems);
  };

  const pendingTaxCount = taxRecords.filter(record => record.status === 'Pending').length;
  const overdueTaxCount = taxRecords.filter(record => record.status === 'Overdue').length;
  const pendingComplianceCount = complianceItems.filter(item => item.status === 'Pending').length;
  const totalTaxAmount = taxRecords
    .filter(record => record.status === 'Pending' || record.status === 'Overdue')
    .reduce((sum, record) => sum + record.amount, 0);

  const AddTaxRecordModal = () => {
    const [formData, setFormData] = useState({
      taxType: '',
      description: '',
      amount: '',
      dueDate: '',
      assessmentYear: '2024-25',
      remarks: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      const newTaxRecord = {
        id: `TAX${String(taxRecords.length + 1).padStart(3, '0')}`,
        taxType: formData.taxType,
        description: formData.description,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: 'Pending',
        paidDate: null,
        challanNumber: null,
        assessmentYear: formData.assessmentYear,
        filingDate: null,
        remarks: formData.remarks
      };

      const updatedTaxRecords = [...taxRecords, newTaxRecord];
      setTaxRecords(updatedTaxRecords);
      saveToStorage('financeTaxRecords', updatedTaxRecords);
      setShowAddModal(false);
      setFormData({
        taxType: '',
        description: '',
        amount: '',
        dueDate: '',
        assessmentYear: '2024-25',
        remarks: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Tax Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.taxType}
              onChange={(e) => setFormData({...formData, taxType: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Tax Type</option>
              {taxTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Assessment Year"
              value={formData.assessmentYear}
              onChange={(e) => setFormData({...formData, assessmentYear: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
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
                Add Record
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
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Taxation</h1>
          <p className="text-gray-600 mt-1">Manage tax obligations and regulatory compliance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tax Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingTaxCount}</p>
              <p className="text-gray-600 text-sm">Pending Tax Payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{overdueTaxCount}</p>
              <p className="text-gray-600 text-sm">Overdue Payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingComplianceCount}</p>
              <p className="text-gray-600 text-sm">Pending Compliance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTaxAmount)}</p>
              <p className="text-gray-600 text-sm">Outstanding Tax</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tax Records</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {taxRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{record.description}</div>
                    <div className="text-sm text-gray-500">{record.taxType} • {formatCurrency(record.amount)}</div>
                    <div className="text-sm text-gray-500">
                      Due: {formatDate(record.dueDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    {record.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(record.id)}
                        className="block mt-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Items</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{item.type}</div>
                    <div className="text-sm text-gray-500">
                      Due: {formatDate(item.dueDate)} • {item.assignedTo}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleCompleteCompliance(item.id)}
                        className="block mt-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tax Payment Schedule</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {taxRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.taxType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.description}</div>
                    <div className="text-sm text-gray-500">AY: {record.assessmentYear}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(record.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(record.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'Paid' && record.challanNumber && (
                      <button className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200">
                        <Download className="w-4 h-4 inline mr-1" />
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTaxRecordModal />
    </div>
  );
};

export default ComplianceTaxation;