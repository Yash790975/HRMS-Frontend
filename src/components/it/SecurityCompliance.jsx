import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, FileText, Users, Lock, Eye, Calendar } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const SecurityCompliance = () => {
  const [securityPolicies, setSecurityPolicies] = useState([]);
  const [complianceAudits, setComplianceAudits] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [trainingRecords, setTrainingRecords] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const policiesData = getFromStorage('securityPolicies') || [];
    const auditsData = getFromStorage('complianceAudits') || [];
    const logsData = getFromStorage('accessLogs') || [];
    const trainingData = getFromStorage('trainingRecords') || [];
    
    setSecurityPolicies(policiesData.length > 0 ? policiesData : generateSecurityPolicies());
    setComplianceAudits(auditsData.length > 0 ? auditsData : generateComplianceAudits());
    setAccessLogs(logsData.length > 0 ? logsData : generateAccessLogs());
    setTrainingRecords(trainingData.length > 0 ? trainingData : generateTrainingRecords());
  };

  const generateSecurityPolicies = () => {
    const policies = [
      {
        id: 'POL001',
        title: 'Password Policy',
        category: 'Authentication',
        description: 'Requirements for strong passwords and regular updates',
        version: '2.1',
        status: 'Active',
        lastUpdated: '2024-01-15',
        nextReview: '2024-07-15',
        owner: 'IT Security Team',
        compliance: 'ISO 27001'
      },
      {
        id: 'POL002',
        title: 'Data Classification Policy',
        category: 'Data Protection',
        description: 'Guidelines for classifying and handling sensitive data',
        version: '1.3',
        status: 'Active',
        lastUpdated: '2024-02-01',
        nextReview: '2024-08-01',
        owner: 'Data Protection Officer',
        compliance: 'GDPR'
      },
      {
        id: 'POL003',
        title: 'Remote Access Policy',
        category: 'Network Security',
        description: 'Security requirements for remote work and VPN access',
        version: '3.0',
        status: 'Active',
        lastUpdated: '2024-01-20',
        nextReview: '2024-07-20',
        owner: 'Network Security Team',
        compliance: 'SOC 2'
      },
      {
        id: 'POL004',
        title: 'Incident Response Policy',
        category: 'Incident Management',
        description: 'Procedures for handling security incidents',
        version: '2.0',
        status: 'Under Review',
        lastUpdated: '2023-12-01',
        nextReview: '2024-06-01',
        owner: 'CISO',
        compliance: 'NIST'
      }
    ];

    saveToStorage('securityPolicies', policies);
    return policies;
  };

  const generateComplianceAudits = () => {
    const audits = [
      {
        id: 'AUD001',
        auditName: 'ISO 27001 Annual Audit',
        auditor: 'External Auditor - CertCorp',
        auditDate: '2024-02-15',
        status: 'Completed',
        score: 95,
        findings: 3,
        criticalFindings: 0,
        nextAudit: '2025-02-15',
        compliance: 'ISO 27001'
      },
      {
        id: 'AUD002',
        auditName: 'GDPR Compliance Review',
        auditor: 'Internal Audit Team',
        auditDate: '2024-01-30',
        status: 'Completed',
        score: 88,
        findings: 5,
        criticalFindings: 1,
        nextAudit: '2024-07-30',
        compliance: 'GDPR'
      },
      {
        id: 'AUD003',
        auditName: 'SOC 2 Type II Audit',
        auditor: 'External Auditor - SecureAudit',
        auditDate: '2024-03-01',
        status: 'In Progress',
        score: null,
        findings: null,
        criticalFindings: null,
        nextAudit: '2025-03-01',
        compliance: 'SOC 2'
      }
    ];

    saveToStorage('complianceAudits', audits);
    return audits;
  };

  const generateAccessLogs = () => {
    const logs = [];
    const users = ['john.doe', 'jane.smith', 'mike.johnson', 'sarah.wilson', 'admin'];
    const systems = ['HR System', 'Finance System', 'Email Server', 'File Server', 'Database'];
    const actions = ['Login', 'Logout', 'File Access', 'Data Export', 'Configuration Change'];

    for (let i = 0; i < 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      logs.push({
        id: `LOG${String(i + 1).padStart(3, '0')}`,
        timestamp: date.toISOString(),
        user: users[Math.floor(Math.random() * users.length)],
        system: systems[Math.floor(Math.random() * systems.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        status: Math.random() > 0.1 ? 'Success' : 'Failed',
        riskLevel: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
      });
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    saveToStorage('accessLogs', logs);
    return logs;
  };

  const generateTrainingRecords = () => {
    const employees = getFromStorage('employees') || [];
    const trainings = [
      'Security Awareness Training',
      'Phishing Prevention',
      'Data Protection Training',
      'Password Security',
      'Incident Response Training'
    ];

    const records = [];
    employees.forEach((employee, empIndex) => {
      trainings.forEach((training, trainIndex) => {
        const completedDate = new Date();
        completedDate.setDate(completedDate.getDate() - Math.floor(Math.random() * 365));
        
        records.push({
          id: `TRN${String(empIndex * trainings.length + trainIndex + 1).padStart(3, '0')}`,
          employeeId: employee.id,
          employeeName: employee.personalDetails?.fullName,
          trainingName: training,
          completedDate: completedDate.toISOString().split('T')[0],
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          status: Math.random() > 0.2 ? 'Completed' : 'Pending',
          expiryDate: new Date(completedDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          certificateIssued: Math.random() > 0.3
        });
      });
    });

    saveToStorage('trainingRecords', records);
    return records;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
      case 'In Progress':
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Failed':
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activePolicies = securityPolicies.filter(policy => policy.status === 'Active').length;
  const completedAudits = complianceAudits.filter(audit => audit.status === 'Completed').length;
  const highRiskLogs = accessLogs.filter(log => log.riskLevel === 'High').length;
  const completedTrainings = trainingRecords.filter(record => record.status === 'Completed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Compliance</h1>
          <p className="text-gray-600 mt-1">Monitor security policies, compliance audits, and access controls</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activePolicies}</p>
              <p className="text-gray-600 text-sm">Active Policies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{completedAudits}</p>
              <p className="text-gray-600 text-sm">Completed Audits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{highRiskLogs}</p>
              <p className="text-gray-600 text-sm">High Risk Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{completedTrainings}</p>
              <p className="text-gray-600 text-sm">Training Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Policies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-600" />
              Security Policies
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityPolicies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                    <div className="text-sm text-gray-500">{policy.category} • v{policy.version}</div>
                    <div className="text-sm text-gray-500">
                      Next Review: {formatDate(policy.nextReview)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {policy.compliance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Audits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-orange-600" />
              Compliance Audits
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complianceAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{audit.auditName}</div>
                    <div className="text-sm text-gray-500">{audit.auditor}</div>
                    <div className="text-sm text-gray-500">
                      Date: {formatDate(audit.auditDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                    {audit.score && (
                      <div className="text-sm text-gray-500 mt-1">
                        Score: {audit.score}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Access Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-orange-600" />
            Recent Access Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.user}</div>
                    <div className="text-sm text-gray-500">{log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.system}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(log.riskLevel)}`}>
                      {log.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Training */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Security Training Status
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
                  Training
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainingRecords.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.trainingName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.status === 'Completed' ? `${record.score}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.status === 'Completed' ? formatDate(record.expiryDate) : '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityCompliance;