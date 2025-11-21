import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, X, Filter, Search } from 'lucide-react';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Load leave requests from localStorage
    const loadLeaveRequests = () => {
      const requests = JSON.parse(localStorage.getItem('hrms_leave_requests') || '[]');
      if (requests.length === 0) {
        // Add sample data
        const sampleRequests = [
          {
            id: 1,
            employeeName: 'John Doe',
            employeeId: 'EMP001',
            leaveType: 'Annual Leave',
            startDate: '2024-01-20',
            endDate: '2024-01-22',
            days: 3,
            reason: 'Family vacation',
            status: 'pending',
            appliedOn: '2024-01-15',
            balance: 18
          },
          {
            id: 2,
            employeeName: 'Sarah Smith',
            employeeId: 'EMP002',
            leaveType: 'Sick Leave',
            startDate: '2024-01-18',
            endDate: '2024-01-19',
            days: 2,
            reason: 'Medical appointment',
            status: 'approved',
            appliedOn: '2024-01-16',
            balance: 8
          },
          {
            id: 3,
            employeeName: 'Mike Johnson',
            employeeId: 'EMP003',
            leaveType: 'Personal Leave',
            startDate: '2024-01-25',
            endDate: '2024-01-26',
            days: 2,
            reason: 'Personal work',
            status: 'pending',
            appliedOn: '2024-01-17',
            balance: 5
          }
        ];
        localStorage.setItem('hrms_leave_requests', JSON.stringify(sampleRequests));
        setLeaveRequests(sampleRequests);
      } else {
        setLeaveRequests(requests);
      }
    };

    loadLeaveRequests();
  }, []);

  useEffect(() => {
    // Filter requests based on search and status
    let filtered = leaveRequests;

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, searchTerm, statusFilter]);

  const handleApproval = (requestId, action, comments = '') => {
    const updatedRequests = leaveRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: action,
          managerComments: comments,
          approvedOn: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    });

    setLeaveRequests(updatedRequests);
    localStorage.setItem('hrms_leave_requests', JSON.stringify(updatedRequests));
    setSelectedRequest(null);
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

  const LeaveRequestModal = ({ request, onClose, onApprove, onReject }) => {
    const [comments, setComments] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Request Details</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee:</span>
              <span className="font-medium">{request.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Leave Type:</span>
              <span className="font-medium">{request.leaveType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{request.startDate} to {request.endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days:</span>
              <span className="font-medium">{request.days} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className="font-medium">{request.balance} days</span>
            </div>
            <div>
              <span className="text-gray-600">Reason:</span>
              <p className="font-medium mt-1">{request.reason}</p>
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
              onClick={() => onApprove(request.id, 'approved', comments)}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onReject(request.id, 'rejected', comments)}
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
        <h1 className="text-2xl font-bold mb-2">Leave Management</h1>
        <p className="text-orange-100">Manage and approve leave requests from your team members</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredRequests.length} requests</span>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.leaveType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.startDate}</div>
                    <div className="text-sm text-gray-500">to {request.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.days} days</div>
                    <div className="text-sm text-gray-500">Balance: {request.balance}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      View Details
                    </button>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleApproval(request.id, 'approved')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(request.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Modal */}
      {selectedRequest && (
        <LeaveRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproval}
          onReject={handleApproval}
        />
      )}
    </div>
  );
};

export default LeaveManagement;