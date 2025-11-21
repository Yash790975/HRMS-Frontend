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
  Award,
  Briefcase,
  DollarSign,
  Gift,
  Target,
  Users,
  FileText
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [dashboardData, setDashboardData] = useState({
    attendance: {},
    tasks: [],
    projects: [],
    payroll: {},
    benefits: [],
    leaves: [],
    performance: {}
  });

  useEffect(() => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));

    // Load dashboard data from localStorage
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
  
  let attendance = JSON.parse(localStorage.getItem("employee_attendance"));
    let tasks = JSON.parse(localStorage.getItem("employee_tasks"));
    let projects = JSON.parse(localStorage.getItem("employee_projects"));
    let payroll = JSON.parse(localStorage.getItem("employee_payroll"));
    let benefits = JSON.parse(localStorage.getItem("employee_benefits"));
    let performance = JSON.parse(localStorage.getItem("employee_performance"));
    // Set default data if empty
    if (Object.keys(attendance).length === 0) {
      const defaultAttendance = {
        todayStatus: 'checked-out',
        checkInTime: '09:00 AM',
        checkOutTime: '06:00 PM',
        hoursWorked: 8,
        weeklyHours: 40,
        monthlyHours: 160
      };
      localStorage.setItem('employee_attendance', JSON.stringify(defaultAttendance));
      attendance = defaultAttendance;
    }

    if (tasks.length === 0) {
      const defaultTasks = [
        { id: 1, title: 'Complete Project Documentation', status: 'in-progress', priority: 'high', dueDate: '2024-01-25' },
        { id: 2, title: 'Review Code Changes', status: 'pending', priority: 'medium', dueDate: '2024-01-23' },
        { id: 3, title: 'Attend Team Meeting', status: 'completed', priority: 'low', dueDate: '2024-01-20' }
      ];
      localStorage.setItem('employee_tasks', JSON.stringify(defaultTasks));
      tasks = defaultTasks;
    }

    if (projects.length === 0) {
      const defaultProjects = [
        { id: 1, name: 'E-commerce Platform', progress: 75, status: 'active', role: 'Frontend Developer' },
        { id: 2, name: 'Mobile App Development', progress: 45, status: 'active', role: 'React Native Developer' }
      ];
      localStorage.setItem('employee_projects', JSON.stringify(defaultProjects));
      projects = defaultProjects;
    }

    if (Object.keys(payroll).length === 0) {
      const defaultPayroll = {
        basicSalary: 75000,
        allowances: 15000,
        deductions: 8000,
        netSalary: 82000,
        lastPayDate: '2024-01-01',
        ytdEarnings: 820000
      };
      localStorage.setItem('employee_payroll', JSON.stringify(defaultPayroll));
      payroll = defaultPayroll;
    }

    if (benefits.length === 0) {
      const defaultBenefits = [
        { id: 1, name: 'Health Insurance', status: 'active', coverage: 'Family' },
        { id: 2, name: 'Life Insurance', status: 'active', coverage: '10x Salary' },
        { id: 3, name: 'Provident Fund', status: 'active', contribution: '12%' }
      ];
      localStorage.setItem('employee_benefits', JSON.stringify(defaultBenefits));
      benefits = defaultBenefits;
    }

    if (Object.keys(performance).length === 0) {
      const defaultPerformance = {
        currentRating: 4.2,
        goalsCompleted: 8,
        totalGoals: 10,
        lastReviewDate: '2024-01-01'
      };
      localStorage.setItem('employee_performance', JSON.stringify(defaultPerformance));
      performance = defaultPerformance;
    }

    setDashboardData({
      attendance,
      tasks,
      projects,
      payroll,
      benefits,
      leaves,
      performance
    });
  };

  const dashboardCards = [
    {
      title: 'Total Leave Balance',
      value: '18',
      subtitle: 'Days remaining',
      change: '+2 from last month',
      icon: Calendar,
      color: 'bg-blue-500',
      bgGradient: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Attendance Status',
      value: dashboardData.attendance.todayStatus === 'checked-in' ? 'Checked In' : 'Checked Out',
      subtitle: dashboardData.attendance.todayStatus === 'checked-in' ? 'At work' : 'Not at work',
      change: `${dashboardData.attendance.weeklyHours || 40} hours this week`,
      icon: Clock,
      color: dashboardData.attendance.todayStatus === 'checked-in' ? 'bg-green-500' : 'bg-gray-500',
      bgGradient: dashboardData.attendance.todayStatus === 'checked-in' ? 'from-green-400 to-green-600' : 'from-gray-400 to-gray-600'
    },
    {
      title: 'Active Tasks',
      value: dashboardData.tasks.filter(task => task.status !== 'completed').length.toString(),
      subtitle: `${dashboardData.tasks.filter(task => task.status === 'completed').length} completed`,
      change: 'Due soon',
      icon: CheckSquare,
      color: 'bg-purple-500',
      bgGradient: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Notifications',
      value: '5',
      subtitle: 'Unread messages',
      change: 'View all',
      icon: Bell,
      color: 'bg-red-500',
      bgGradient: 'from-red-400 to-red-600'
    }
  ];

  const quickActions = [
    {
      title: dashboardData.attendance.todayStatus === 'checked-in' ? 'Check Out' : 'Check In',
      subtitle: dashboardData.attendance.todayStatus === 'checked-in' ? 'End your workday' : 'Start your workday',
      icon: Clock,
      color: dashboardData.attendance.todayStatus === 'checked-in' ? 'bg-red-500' : 'bg-green-500'
    },
    {
      title: 'Apply Leave',
      subtitle: 'Request time off',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Submit Expense',
      subtitle: 'Upload receipts',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      title: 'Leave request approved',
      description: 'Your vacation request for Jan 15-17 has been approved',
      time: 'about 2 hours ago',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'New task assigned',
      description: 'Complete project documentation by Jan 25',
      time: '1 day ago',
      icon: CheckSquare,
      color: 'text-blue-500'
    },
    {
      title: 'Performance review scheduled',
      description: 'Annual review meeting on Jan 30',
      time: '2 days ago',
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Krishna!</h1>
          <p className="text-lg opacity-90 mb-1">Software Developer • Engineering</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600">{action.title}</h4>
                      <p className="text-sm text-gray-500">{action.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
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
                    <div className="p-2 rounded-lg bg-gray-100">
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

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Attendance Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today's Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dashboardData.attendance.todayStatus === 'checked-in' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dashboardData.attendance.todayStatus === 'checked-in' ? 'Checked In' : 'Checked Out'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hours Today</span>
                <span className="font-medium">{dashboardData.attendance.hoursWorked}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Week</span>
                <span className="font-medium">{dashboardData.attendance.weeklyHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium">{dashboardData.attendance.monthlyHours}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-purple-500" />
              My Tasks
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardData.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
              My Projects
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{project.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payroll & Compensation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Payroll & Compensation
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Salary</span>
                <span className="font-medium text-green-600">₹{dashboardData.payroll.netSalary?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">YTD Earnings</span>
                <span className="font-medium">₹{dashboardData.payroll.ytdEarnings?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Pay Date</span>
                <span className="font-medium">{dashboardData.payroll.lastPayDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-pink-500" />
            Employee Benefits
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.benefits.map((benefit) => (
              <div key={benefit.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{benefit.name}</h4>
                <p className="text-sm text-gray-600 mb-1">Status: {benefit.status}</p>
                <p className="text-sm text-gray-600">Coverage: {benefit.coverage || benefit.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;