import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Package, AlertTriangle } from 'lucide-react';
import { getFromStorage } from '../../utils/localStorage';

const ReportsAnalytics = () => {
  const [reportData, setReportData] = useState({
    assets: [],
    tickets: [],
    licenses: [],
    users: []
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    const assets = getFromStorage('itAssets') || [];
    const tickets = getFromStorage('helpDeskTickets') || [];
    const licenses = getFromStorage('softwareLicenses') || [];
    const users = getFromStorage('userAccounts') || [];

    setReportData({ assets, tickets, licenses, users });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Asset Analytics
  const assetsByType = reportData.assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {});

  const assetsByStatus = reportData.assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const totalAssetValue = reportData.assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0);

  // Ticket Analytics
  const ticketsByStatus = reportData.tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  const ticketsByPriority = reportData.tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});

  const ticketsByCategory = reportData.tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  // License Analytics
  const licensesByStatus = reportData.licenses.reduce((acc, license) => {
    acc[license.status] = (acc[license.status] || 0) + 1;
    return acc;
  }, {});

  const totalLicenseCost = reportData.licenses.reduce((sum, license) => sum + (license.cost || 0), 0);

  const licenseUtilization = reportData.licenses.map(license => ({
    name: license.softwareName,
    used: license.usedLicenses,
    total: license.totalLicenses,
    utilization: Math.round((license.usedLicenses / license.totalLicenses) * 100)
  }));

  // User Analytics
  const usersByStatus = reportData.users.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {});

  const usersByRole = reportData.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const generateReport = (reportType) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      reportType,
      data: {}
    };

    switch (reportType) {
      case 'assets':
        reportData.data = {
          summary: {
            totalAssets: reportData.assets.length,
            totalValue: totalAssetValue,
            byType: assetsByType,
            byStatus: assetsByStatus
          },
          details: reportData.assets
        };
        break;
      case 'tickets':
        reportData.data = {
          summary: {
            totalTickets: reportData.tickets.length,
            byStatus: ticketsByStatus,
            byPriority: ticketsByPriority,
            byCategory: ticketsByCategory
          },
          details: reportData.tickets
        };
        break;
      case 'licenses':
        reportData.data = {
          summary: {
            totalLicenses: reportData.licenses.length,
            totalCost: totalLicenseCost,
            byStatus: licensesByStatus,
            utilization: licenseUtilization
          },
          details: reportData.licenses
        };
        break;
      case 'users':
        reportData.data = {
          summary: {
            totalUsers: reportData.users.length,
            byStatus: usersByStatus,
            byRole: usersByRole
          },
          details: reportData.users
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
              <span className="text-sm font-medium text-gray-900 w-8 text-right">{value}</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">IT performance metrics and detailed reports</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total IT Assets"
          value={reportData.assets.length}
          icon={Package}
          color="from-blue-600 to-blue-700"
          change={{ type: 'positive', value: '+5.2%' }}
        />
        <MetricCard
          title="Open Tickets"
          value={Object.values(ticketsByStatus).reduce((a, b) => a + b, 0)}
          icon={AlertTriangle}
          color="from-amber-600 to-amber-700"
          change={{ type: 'negative', value: '-12.3%' }}
        />
        <MetricCard
          title="Active Users"
          value={usersByStatus.Active || 0}
          icon={Users}
          color="from-green-600 to-green-700"
          change={{ type: 'positive', value: '+8.1%' }}
        />
        <MetricCard
          title="IT Budget Spent"
          value={formatCurrency(totalAssetValue + totalLicenseCost)}
          icon={DollarSign}
          color="from-purple-600 to-purple-700"
          change={{ type: 'positive', value: '+15.7%' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Assets by Type" data={assetsByType} />
        <ChartCard title="Assets by Status" data={assetsByStatus} />
        <ChartCard title="Tickets by Priority" data={ticketsByPriority} />
        <ChartCard title="Tickets by Category" data={ticketsByCategory} />
      </div>

      {/* License Utilization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Utilization</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Software
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used / Total
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
              {licenseUtilization.map((license, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{license.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{license.used} / {license.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            license.utilization >= 90 ? 'bg-red-500' : 
                            license.utilization >= 75 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${license.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{license.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      license.utilization >= 90 ? 'bg-red-100 text-red-800' : 
                      license.utilization >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {license.utilization >= 90 ? 'Critical' : license.utilization >= 75 ? 'Warning' : 'Good'}
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
            onClick={() => generateReport('assets')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <div className="text-center">
              <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Assets Report</p>
              <p className="text-xs text-gray-500">Download asset inventory</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('tickets')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Tickets Report</p>
              <p className="text-xs text-gray-500">Download support tickets</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('licenses')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <div className="text-center">
              <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Licenses Report</p>
              <p className="text-xs text-gray-500">Download license data</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('users')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Users Report</p>
              <p className="text-xs text-gray-500">Download user accounts</p>
            </div>
          </button>
        </div>
      </div>

      {/* Trends and Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Asset Utilization</h4>
            <p className="text-sm text-blue-700">
              {Math.round((assetsByStatus.Assigned || 0) / reportData.assets.length * 100)}% of assets are currently assigned to employees.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Ticket Resolution</h4>
            <p className="text-sm text-amber-700">
              {Math.round((ticketsByStatus.Resolved || 0) / reportData.tickets.length * 100)}% of tickets have been resolved successfully.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">License Efficiency</h4>
            <p className="text-sm text-green-700">
              Average license utilization is {Math.round(licenseUtilization.reduce((sum, l) => sum + l.utilization, 0) / licenseUtilization.length)}%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;