import React, { useState, useEffect } from 'react';
import { Server, Monitor, Wifi, Database, Shield, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDateTime } from '../../utils/helpers';

const SystemAdministration = () => {
  const [systemStatus, setSystemStatus] = useState([]);
  const [networkDevices, setNetworkDevices] = useState([]);
  const [securityIncidents, setSecurityIncidents] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const systemData = getFromStorage('systemStatus') || [];
    const networkData = getFromStorage('networkDevices') || [];
    const securityData = getFromStorage('securityIncidents') || [];
    const maintenanceData = getFromStorage('maintenanceSchedule') || [];
    
    setSystemStatus(systemData.length > 0 ? systemData : generateSystemStatus());
    setNetworkDevices(networkData.length > 0 ? networkData : generateNetworkDevices());
    setSecurityIncidents(securityData.length > 0 ? securityData : generateSecurityIncidents());
    setMaintenanceSchedule(maintenanceData.length > 0 ? maintenanceData : generateMaintenanceSchedule());
  };

  const generateSystemStatus = () => {
    const systems = [
      {
        id: 'SYS001',
        name: 'Web Server',
        type: 'Server',
        status: 'Online',
        uptime: '99.9%',
        lastCheck: new Date().toISOString(),
        cpu: 45,
        memory: 68,
        disk: 72,
        location: 'Data Center A'
      },
      {
        id: 'SYS002',
        name: 'Database Server',
        type: 'Database',
        status: 'Online',
        uptime: '99.8%',
        lastCheck: new Date().toISOString(),
        cpu: 62,
        memory: 78,
        disk: 55,
        location: 'Data Center A'
      },
      {
        id: 'SYS003',
        name: 'Email Server',
        type: 'Email',
        status: 'Online',
        uptime: '99.7%',
        lastCheck: new Date().toISOString(),
        cpu: 35,
        memory: 52,
        disk: 48,
        location: 'Data Center B'
      },
      {
        id: 'SYS004',
        name: 'File Server',
        type: 'Storage',
        status: 'Maintenance',
        uptime: '98.5%',
        lastCheck: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        cpu: 0,
        memory: 0,
        disk: 85,
        location: 'Data Center A'
      },
      {
        id: 'SYS005',
        name: 'Backup Server',
        type: 'Backup',
        status: 'Online',
        uptime: '99.6%',
        lastCheck: new Date().toISOString(),
        cpu: 25,
        memory: 42,
        disk: 90,
        location: 'Data Center B'
      }
    ];

    saveToStorage('systemStatus', systems);
    return systems;
  };

  const generateNetworkDevices = () => {
    const devices = [
      {
        id: 'NET001',
        name: 'Core Switch',
        type: 'Switch',
        ip: '192.168.1.1',
        status: 'Online',
        location: 'Server Room',
        ports: 48,
        portsUsed: 32,
        lastPing: new Date().toISOString()
      },
      {
        id: 'NET002',
        name: 'Main Router',
        type: 'Router',
        ip: '192.168.1.254',
        status: 'Online',
        location: 'Network Room',
        ports: 4,
        portsUsed: 3,
        lastPing: new Date().toISOString()
      },
      {
        id: 'NET003',
        name: 'WiFi Controller',
        type: 'Wireless',
        ip: '192.168.1.10',
        status: 'Online',
        location: 'IT Room',
        ports: 0,
        portsUsed: 0,
        lastPing: new Date().toISOString()
      },
      {
        id: 'NET004',
        name: 'Firewall',
        type: 'Security',
        ip: '192.168.1.2',
        status: 'Online',
        location: 'Security Zone',
        ports: 8,
        portsUsed: 6,
        lastPing: new Date().toISOString()
      }
    ];

    saveToStorage('networkDevices', devices);
    return devices;
  };

  const generateSecurityIncidents = () => {
    const incidents = [
      {
        id: 'SEC001',
        title: 'Failed login attempts detected',
        severity: 'Medium',
        status: 'Investigating',
        reportedDate: '2024-03-11',
        description: 'Multiple failed login attempts from external IP',
        affectedSystems: ['Web Server', 'Email Server'],
        assignedTo: 'Security Team'
      },
      {
        id: 'SEC002',
        title: 'Suspicious network traffic',
        severity: 'High',
        status: 'Resolved',
        reportedDate: '2024-03-10',
        description: 'Unusual outbound traffic pattern detected',
        affectedSystems: ['Network Infrastructure'],
        assignedTo: 'Network Team'
      },
      {
        id: 'SEC003',
        title: 'Malware detection',
        severity: 'Critical',
        status: 'Contained',
        reportedDate: '2024-03-09',
        description: 'Malware detected on workstation',
        affectedSystems: ['Workstation-045'],
        assignedTo: 'IT Security'
      }
    ];

    saveToStorage('securityIncidents', incidents);
    return incidents;
  };

  const generateMaintenanceSchedule = () => {
    const schedule = [
      {
        id: 'MAINT001',
        title: 'Server Patch Updates',
        type: 'Software Update',
        scheduledDate: '2024-03-15',
        duration: '4 hours',
        status: 'Scheduled',
        affectedSystems: ['Web Server', 'Database Server'],
        assignedTo: 'System Admin',
        downtime: true
      },
      {
        id: 'MAINT002',
        title: 'Network Equipment Firmware',
        type: 'Firmware Update',
        scheduledDate: '2024-03-18',
        duration: '2 hours',
        status: 'Scheduled',
        affectedSystems: ['Core Switch', 'Main Router'],
        assignedTo: 'Network Team',
        downtime: true
      },
      {
        id: 'MAINT003',
        title: 'Backup System Test',
        type: 'Testing',
        scheduledDate: '2024-03-20',
        duration: '6 hours',
        status: 'Scheduled',
        affectedSystems: ['Backup Server'],
        assignedTo: 'System Admin',
        downtime: false
      }
    ];

    saveToStorage('maintenanceSchedule', schedule);
    return schedule;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Offline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Maintenance':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-green-100 text-green-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const onlineCount = systemStatus.filter(system => system.status === 'Online').length;
  const offlineCount = systemStatus.filter(system => system.status === 'Offline').length;
  const maintenanceCount = systemStatus.filter(system => system.status === 'Maintenance').length;
  const criticalIncidents = securityIncidents.filter(incident => incident.severity === 'Critical').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600 mt-1">Monitor and manage IT infrastructure</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{onlineCount}</p>
              <p className="text-gray-600 text-sm">Systems Online</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{maintenanceCount}</p>
              <p className="text-gray-600 text-sm">Under Maintenance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{criticalIncidents}</p>
              <p className="text-gray-600 text-sm">Critical Incidents</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
              <p className="text-gray-600 text-sm">Overall Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Server className="w-5 h-5 mr-2 text-orange-600" />
              System Status
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemStatus.map((system) => (
                <div key={system.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(system.status)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{system.name}</div>
                      <div className="text-sm text-gray-500">{system.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      Uptime: {system.uptime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Network Devices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-orange-600" />
              Network Devices
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {networkDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(device.status)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{device.name}</div>
                      <div className="text-sm text-gray-500">{device.ip}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                    {device.ports > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Ports: {device.portsUsed}/{device.ports}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Incidents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-orange-600" />
            Security Incidents
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                      <div className="text-sm text-gray-500">{incident.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{incident.assignedTo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{incident.reportedDate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Maintenance Schedule
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downtime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceSchedule.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{maintenance.title}</div>
                      <div className="text-sm text-gray-500">
                        Assigned to: {maintenance.assignedTo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{maintenance.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{maintenance.scheduledDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{maintenance.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      maintenance.downtime ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {maintenance.downtime ? 'Yes' : 'No'}
                    </span>
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

export default SystemAdministration;