import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [reportData, setReportData] = useState({
    attendance: [],
    leave: [],
    performance: [],
    tasks: []
  });

  useEffect(() => {
    // Generate sample report data
    const generateReportData = () => {
      const attendanceData = [
        { month: 'Jan', present: 85, absent: 15, wfh: 25 },
        { month: 'Feb', present: 88, absent: 12, wfh: 30 },
        { month: 'Mar', present: 92, absent: 8, wfh: 28 },
        { month: 'Apr', present: 87, absent: 13, wfh: 32 },
        { month: 'May', present: 90, absent: 10, wfh: 35 },
        { month: 'Jun', present: 89, absent: 11, wfh: 33 }
      ];

      const leaveData = [
        { type: 'Annual Leave', count: 45, color: '#3B82F6' },
        { type: 'Sick Leave', count: 23, color: '#EF4444' },
        { type: 'Personal Leave', count: 12, color: '#10B981' },
        { type: 'Emergency Leave', count: 8, color: '#F59E0B' }
      ];

      const performanceData = [
        { employee: 'John Doe', rating: 4.5, goals: 8, completed: 7 },
        { employee: 'Sarah Smith', rating: 4.8, goals: 10, completed: 9 },
        { employee: 'Mike Johnson', rating: 4.2, goals: 6, completed: 5 },
        { employee: 'Emily Davis', rating: 4.6, goals: 9, completed: 8 }
      ];

      const tasksData = [
        { month: 'Jan', completed: 35, pending: 12, overdue: 3 },
        { month: 'Feb', completed: 42, pending: 8, overdue: 2 },
        { month: 'Mar', completed: 38, pending: 15, overdue: 4 },
        { month: 'Apr', completed: 45, pending: 10, overdue: 1 },
        { month: 'May', completed: 40, pending: 18, overdue: 5 },
        { month: 'Jun', completed: 48, pending: 12, overdue: 2 }
      ];

      setReportData({
        attendance: attendanceData,
        leave: leaveData,
        performance: performanceData,
        tasks: tasksData
      });
    };

    generateReportData();
  }, []);

  const downloadReport = (reportType) => {
    let csvContent = '';
    let fileName = '';

    switch (reportType) {
      case 'attendance':
        csvContent = [
          ['Month', 'Present', 'Absent', 'WFH'],
          ...reportData.attendance.map(row => [row.month, row.present, row.absent, row.wfh])
        ].map(row => row.join(',')).join('\n');
        fileName = 'attendance_report.csv';
        break;
      case 'leave':
        csvContent = [
          ['Leave Type', 'Count'],
          ...reportData.leave.map(row => [row.type, row.count])
        ].map(row => row.join(',')).join('\n');
        fileName = 'leave_report.csv';
        break;
      case 'performance':
        csvContent = [
          ['Employee', 'Rating', 'Goals', 'Completed'],
          ...reportData.performance.map(row => [row.employee, row.rating, row.goals, row.completed])
        ].map(row => row.join(',')).join('\n');
        fileName = 'performance_report.csv';
        break;
      case 'tasks':
        csvContent = [
          ['Month', 'Completed', 'Pending', 'Overdue'],
          ...reportData.tasks.map(row => [row.month, row.completed, row.pending, row.overdue])
        ].map(row => row.join(',')).join('\n');
        fileName = 'tasks_report.csv';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ReportCard = ({ title, icon: Icon, children, onDownload }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Download</span>
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-orange-100">Comprehensive insights into your team's performance and activities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Report */}
        <ReportCard
          title="Attendance Report"
          icon={Users}
          onDownload={() => downloadReport('attendance')}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.attendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="wfh" fill="#3B82F6" name="WFH" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Leave Report */}
        <ReportCard
          title="Leave Report"
          icon={Calendar}
          onDownload={() => downloadReport('leave')}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.leave}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {reportData.leave.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center mt-4 space-x-4">
            {reportData.leave.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.type}: {entry.count}</span>
              </div>
            ))}
          </div>
        </ReportCard>

        {/* Performance Report */}
        <ReportCard
          title="Performance Report"
          icon={TrendingUp}
          onDownload={() => downloadReport('performance')}
        >
          <div className="space-y-3">
            {reportData.performance.map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{employee.employee}</p>
                  <p className="text-sm text-gray-600">Goals: {employee.completed}/{employee.goals}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(employee.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{employee.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </ReportCard>

        {/* Tasks Report */}
        <ReportCard
          title="Tasks Report"
          icon={Clock}
          onDownload={() => downloadReport('tasks')}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.tasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Pending" />
              <Line type="monotone" dataKey="overdue" stroke="#EF4444" name="Overdue" />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Custom Report Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Report Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="attendance">Attendance</option>
              <option value="leave">Leave</option>
              <option value="performance">Performance</option>
              <option value="tasks">Tasks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;