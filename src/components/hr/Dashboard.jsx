import React from 'react';
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import EmployeesManagement from './EmployeesManagement';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'orange'
    },
    {
      title: 'New Hires This Month',
      value: '12',
      change: '+25%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'emerald'
    },
    {
      title: 'Pending Leave Requests',
      value: '8',
      change: '-15%',
      changeType: 'negative',
      icon: Calendar,
      color: 'amber'
    },
    {
      title: 'Monthly Payroll',
      value: '₹84.2L',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple'
    }
  ];
 const navigate = useNavigate();
  
const handleClick = (route) => {
  navigate(route);
};
  const recentActivities = [
    {
      id: 1,
      action: 'New employee onboarded',
      employee: 'Sarah Johnson',
      time: '2 hours ago',
      type: 'onboarding'
    },
    {
      id: 2,
      action: 'Leave request approved',
      employee: 'Michael Chen',
      time: '4 hours ago',
      type: 'leave'
    },
    {
      id: 3,
      action: 'Payroll processed',
      employee: 'Finance Team',
      time: '1 day ago',
      type: 'payroll'
    },
    {
      id: 4,
      action: 'Asset assigned',
      employee: 'David Kumar',
      time: '2 days ago',
      type: 'asset'
    }
  ];

  const colorClasses = {
    orange: 'from-orange-600 to-orange-700',
    emerald: 'from-emerald-600 to-emerald-700',
    amber: 'from-amber-600 to-amber-700',
    purple: 'from-purple-600 to-purple-700'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-orange-100">Here's what's happening with your workforce today.</p>
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

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.employee} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleClick('/hr-portal/employees')} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left">
              <UserPlus className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Employee</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/leave')} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-left">
              <Calendar className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Leaves</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/payroll')} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
              <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Process Payroll</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/expenses')} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-left">
              <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Expenses</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;