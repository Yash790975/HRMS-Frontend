import React, { useState, useEffect } from 'react';
import { Settings, Plus, Search, Clock, CheckCircle, Package, Download, Key, HelpCircle } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';

const EmployeeSelfService = () => {
  const [requests, setRequests] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('');

  const requestTypes = [
    { id: 'equipment', name: 'Equipment Request', icon: Package },
    { id: 'software', name: 'Software Installation', icon: Download },
    { id: 'access', name: 'System Access', icon: Key },
    { id: 'support', name: 'Technical Support', icon: HelpCircle }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const requestsData = getFromStorage('employeeRequests') || [];
    const assetsData = getFromStorage('itAssets') || [];
    const ticketsData = getFromStorage('helpDeskTickets') || [];
    
    setRequests(requestsData);
    
    // Filter assets assigned to current user (for demo, using first employee)
    const currentUserAssets = assetsData.filter(asset => asset.assignedTo === 'EMP001');
    setMyAssets(currentUserAssets);
    
    // Filter tickets created by current user
    const currentUserTickets = ticketsData.filter(ticket => ticket.requesterId === 'EMP001');
    setMyTickets(currentUserTickets);

    // Generate sample requests if none exist
    if (requestsData.length === 0) {
      generateSampleRequests();
    }
  };

  const generateSampleRequests = () => {
    const sampleRequests = [
      {
        id: 'REQ001',
        type: 'equipment',
        title: 'New Monitor Request',
        description: 'Need a second monitor for development work',
        status: 'Approved',
        priority: 'Medium',
        requestDate: '2024-03-01',
        approvedDate: '2024-03-02',
        expectedDelivery: '2024-03-05',
        requestedBy: 'Current User',
        approvedBy: 'IT Manager'
      },
      {
        id: 'REQ002',
        type: 'software',
        title: 'Adobe Photoshop License',
        description: 'Need Photoshop for design work',
        status: 'Pending',
        priority: 'Low',
        requestDate: '2024-03-10',
        approvedDate: null,
        expectedDelivery: null,
        requestedBy: 'Current User',
        approvedBy: null
      },
      {
        id: 'REQ003',
        type: 'access',
        title: 'Database Access Request',
        description: 'Need read access to production database',
        status: 'Under Review',
        priority: 'High',
        requestDate: '2024-03-08',
        approvedDate: null,
        expectedDelivery: null,
        requestedBy: 'Current User',
        approvedBy: null
      }
    ];

    setRequests(sampleRequests);
    saveToStorage('employeeRequests', sampleRequests);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePasswordReset = () => {
    alert('Password reset link has been sent to your email address.');
  };

  const RequestModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'Medium',
      justification: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const newRequest = {
        id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
        type: requestType,
        title: formData.title,
        description: formData.description,
        status: 'Pending',
        priority: formData.priority,
        requestDate: new Date().toISOString().split('T')[0],
        approvedDate: null,
        expectedDelivery: null,
        requestedBy: 'Current User',
        approvedBy: null,
        justification: formData.justification
      };

      const updatedRequests = [...requests, newRequest];
      setRequests(updatedRequests);
      saveToStorage('employeeRequests', updatedRequests);
      setShowRequestModal(false);
      setRequestType('');
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        justification: ''
      });
    };

    if (!showRequestModal) return null;

    const selectedType = requestTypes.find(type => type.id === requestType);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            {selectedType && <selectedType.icon className="w-5 h-5 mr-2 text-orange-600" />}
            {selectedType?.name} Request
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Request Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <textarea
              placeholder="Detailed Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={4}
              required
            />
            <textarea
              placeholder="Business Justification"
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const pendingRequests = requests.filter(req => req.status === 'Pending').length;
  const approvedRequests = requests.filter(req => req.status === 'Approved').length;
  const openTickets = myTickets.filter(ticket => ticket.status === 'Open').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Self-Service</h1>
          <p className="text-gray-600 mt-1">Submit requests and manage your IT resources</p>
        </div>
        <button
          onClick={handlePasswordReset}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <Key className="w-4 h-4 mr-2" />
          Reset Password
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              <p className="text-gray-600 text-sm">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              <p className="text-gray-600 text-sm">Approved Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{myAssets.length}</p>
              <p className="text-gray-600 text-sm">My Assets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
              <p className="text-gray-600 text-sm">Open Tickets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit New Request</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {requestTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => {
                  setRequestType(type.id);
                  setShowRequestModal(true);
                }}
                className="flex items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="text-center">
                  <Icon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">{type.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No requests found</p>
                    <p className="text-sm">Submit your first request using the buttons above</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const typeInfo = requestTypes.find(type => type.id === request.type);
                  const Icon = typeInfo?.icon || Settings;
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Icon className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500">{request.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{typeInfo?.name || request.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(request.requestDate)}
                        </div>
                        {request.expectedDelivery && (
                          <div className="text-sm text-gray-500">
                            Expected: {formatDate(request.expectedDelivery)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Assets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Assigned Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myAssets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No assets assigned</p>
                    <p className="text-sm">Contact IT to request equipment</p>
                  </td>
                </tr>
              ) : (
                myAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(asset.assignedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                        asset.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                        asset.condition === 'Fair' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {asset.condition}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RequestModal />
    </div>
  );
};

export default EmployeeSelfService;