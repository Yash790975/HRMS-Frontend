import React, { useState, useEffect } from 'react';
import { Clock, User, Check, X, Calendar, Projector as Project } from 'lucide-react';

const TimesheetApproval = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  useEffect(() => {
    // Load timesheets from localStorage
    const loadTimesheets = () => {
      const data = JSON.parse(localStorage.getItem('hrms_timesheets') || '[]');
      if (data.length === 0) {
        // Add sample data
        const sampleTimesheets = [
          {
            id: 1,
            employeeName: 'John Doe',
            employeeId: 'EMP001',
            weekStart: '2024-01-15',
            weekEnd: '2024-01-21',
            totalHours: 40,
            status: 'pending',
            submittedOn: '2024-01-22',
            projects: [
              { name: 'Project Alpha', hours: 25 },
              { name: 'Project Beta', hours: 15 }
            ]
          },
          {
            id: 2,
            employeeName: 'Sarah Smith',
            employeeId: 'EMP002',
            weekStart: '2024-01-15',
            weekEnd: '2024-01-21',
            totalHours: 42,
            status: 'approved',
            submittedOn: '2024-01-22',
            projects: [
              { name: 'Project Gamma', hours: 30 },
              { name: 'Project Delta', hours: 12 }
            ]
          }
        ];
        localStorage.setItem('hrms_timesheets', JSON.stringify(sampleTimesheets));
        setTimesheets(sampleTimesheets);
      } else {
        setTimesheets(data);
      }
    };

    loadTimesheets();
  }, []);

  const handleApproval = (timesheetId, action, comments = '') => {
    const updatedTimesheets = timesheets.map(timesheet => {
      if (timesheet.id === timesheetId) {
        return {
          ...timesheet,
          status: action,
          managerComments: comments,
          approvedOn: new Date().toISOString().split('T')[0]
        };
      }
      return timesheet;
    });

    setTimesheets(updatedTimesheets);
    localStorage.setItem('hrms_timesheets', JSON.stringify(updatedTimesheets));
    setSelectedTimesheet(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TimesheetDetailModal = ({ timesheet, onClose, onApprove, onReject }) => {
    const [comments, setComments] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Timesheet Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Employee:</span>
                <span className="font-medium">{timesheet.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Week:</span>
                <span className="font-medium">{timesheet.weekStart} to {timesheet.weekEnd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-medium">{timesheet.totalHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium">{timesheet.submittedOn}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Project Breakdown:</h4>
              <div className="space-y-2">
                {timesheet.projects.map((project, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{project.name}</span>
                    <span className="text-sm font-medium text-gray-900">{project.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="3"
              placeholder="Add comments..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onApprove(timesheet.id, 'approved', comments)}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onReject(timesheet.id, 'rejected', comments)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Timesheet Approval</h1>
        <p className="text-orange-100">Review and approve submitted timesheets from your team</p>
      </div>

      {/* Timesheets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {timesheets.map((timesheet) => (
          <div key={timesheet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{timesheet.employeeName}</h3>
                  <p className="text-sm text-gray-600">{timesheet.employeeId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(timesheet.status)}`}>
                {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Week Period</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {timesheet.weekStart} to {timesheet.weekEnd}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Total Hours</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{timesheet.totalHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Project className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Projects</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{timesheet.projects.length}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTimesheet(timesheet)}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                View Details
              </button>
              {timesheet.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproval(timesheet.id, 'approved')}
                    className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApproval(timesheet.id, 'rejected')}
                    className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timesheet Detail Modal */}
      {selectedTimesheet && (
        <TimesheetDetailModal
          timesheet={selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          onApprove={handleApproval}
          onReject={handleApproval}
        />
      )}
    </div>
  );
};

export default TimesheetApproval;