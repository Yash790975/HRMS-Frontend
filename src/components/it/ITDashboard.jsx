import React from 'react';
import { Package, Headphones, Users, Server, Download, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const ITDashboard = () => {
  const stats = [
    {
      title: 'Total Assets',
      value: '1,248',
      change: '+5%',
      changeType: 'positive',
      icon: Package,
      color: 'orange'
    },
    {
      title: 'Open Tickets',
      value: '23',
      change: '-12%',
      changeType: 'negative',
      icon: Headphones,
      color: 'red'
    },
    {
      title: 'Active Users',
      value: '342',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'emerald'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: Server,
      color: 'blue'
    }
  ];

  const recentTickets = [
    {
      id: 'TKT001',
      title: 'Laptop not starting',
      user: 'John Doe',
      priority: 'High',
      status: 'In Progress',
      time: '2 hours ago'
    },
    {
      id: 'TKT002',
      title: 'Software installation request',
      user: 'Jane Smith',
      priority: 'Medium',
      status: 'Open',
      time: '4 hours ago'
    },
    {
      id: 'TKT003',
      title: 'Network connectivity issue',
      user: 'Mike Johnson',
      priority: 'High',
      status: 'Resolved',
      time: '1 day ago'
    },
    {
      id: 'TKT004',
      title: 'Password reset request',
      user: 'Sarah Wilson',
      priority: 'Low',
      status: 'Open',
      time: '2 days ago'
    }
  ];

  const systemStatus = [
    { name: 'Web Server', status: 'Online', uptime: '99.9%' },
    { name: 'Database Server', status: 'Online', uptime: '99.8%' },
    { name: 'Email Server', status: 'Online', uptime: '99.7%' },
    { name: 'File Server', status: 'Maintenance', uptime: '98.5%' }
  ];

  const colorClasses = {
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
    emerald: 'from-emerald-600 to-emerald-700',
    blue: 'from-blue-600 to-blue-700'
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-amber-100 text-amber-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to IT Portal! 🖥️</h1>
        <p className="text-orange-100">Monitor and manage your IT infrastructure and support operations.</p>
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
        {/* Recent Tickets */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            <Headphones className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{ticket.user} • {ticket.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <Server className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {systemStatus.map((system, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {system.status === 'Online' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{system.name}</p>
                    <p className="text-xs text-gray-500">Uptime: {system.uptime}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  system.status === 'Online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {system.status}
                </span>
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
            <Package className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Asset</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
            <Headphones className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Create Ticket</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-left">
            <Users className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Manage Users</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
            <Download className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Software Licenses</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ITDashboard;