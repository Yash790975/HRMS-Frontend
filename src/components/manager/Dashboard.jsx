
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckSquare,
  Bell,
  User,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  const dashboardCards = [
    {
      title: 'Total Leave Balance',
      value: '114',
      subtitle: 'Days remaining',
      change: '+2 from last month',
      icon: Calendar,
      color: 'bg-orange-500',
      bgGradient: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Attendance Status',
      value: 'Checked Out',
      subtitle: 'Not at work',
      change: '2 days this month',
      icon: Clock,
      color: 'bg-gray-500',
      bgGradient: 'from-gray-400 to-gray-600'
    },
    {
      title: 'Active Tasks',
      value: '2',
      subtitle: '0 completed',
      change: 'Due soon',
      icon: CheckSquare,
      color: 'bg-purple-500',
      bgGradient: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Notifications',
      value: '2',
      subtitle: 'Unread messages',
      change: 'View all',
      icon: Bell,
      color: 'bg-red-500',
      bgGradient: 'from-red-400 to-red-600'
    }
  ];

  const quickActions = [
    {
      title: 'Check In',
      subtitle: 'Start your workday',
      icon: Clock,
      color: 'bg-green-500'
    }
  ];

  const recentActivities = [
    {
      title: 'Leave request approved',
      description: 'Your vacation request for Jan 15-17 has been approved',
      time: 'about 2 hours ago',
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-blue-600 p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Krishna!</h1>
          <p className="text-lg opacity-90 mb-1">Product Manager</p>
          <p className="opacity-75">Today is {currentDate}</p>
        </div>
        <div className="absolute top-4 right-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
                <p className="text-xs text-blue-600">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-orange-600">{action.title}</h4>
                      <p className="text-sm text-gray-500">{action.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;