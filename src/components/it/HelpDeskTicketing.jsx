import React, { useState, useEffect } from 'react';
import { Headphones, Plus, Search, Filter, Clock, User, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate, formatDateTime } from '../../utils/helpers';

const HelpDeskTicketing = () => {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const ticketStatuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'On Hold'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const categories = ['Hardware', 'Software', 'Network', 'Account Access', 'Email', 'Security', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const ticketsData = getFromStorage('helpDeskTickets') || [];
    
    setEmployees(employeesData);
    setTickets(ticketsData);

    // Generate sample tickets if none exist
    if (ticketsData.length === 0 && employeesData.length > 0) {
      generateSampleTickets(employeesData);
    }
  };

  const generateSampleTickets = (employeesData) => {
    const sampleTickets = [
      {
        id: 'TKT001',
        title: 'Laptop not starting',
        description: 'My laptop is not turning on after the latest update. The power button lights up but screen remains black.',
        category: 'Hardware',
        priority: 'High',
        status: 'In Progress',
        requesterId: employeesData[0]?.id,
        requesterName: employeesData[0]?.personalDetails?.fullName,
        requesterEmail: employeesData[0]?.personalDetails?.email,
        assignedTo: 'IT Support Team',
        createdDate: '2024-03-10',
        updatedDate: '2024-03-11',
        dueDate: '2024-03-12',
        resolution: null,
        comments: [
          {
            id: 1,
            author: 'IT Support',
            message: 'Ticket received. Checking hardware diagnostics.',
            timestamp: '2024-03-10T10:30:00Z'
          },
          {
            id: 2,
            author: 'IT Support',
            message: 'Hardware test completed. Replacing RAM module.',
            timestamp: '2024-03-11T14:15:00Z'
          }
        ]
      },
      {
        id: 'TKT002',
        title: 'Software installation request',
        description: 'Need Adobe Creative Suite installed for design work. Please install Photoshop, Illustrator, and InDesign.',
        category: 'Software',
        priority: 'Medium',
        status: 'Open',
        requesterId: employeesData[1]?.id,
        requesterName: employeesData[1]?.personalDetails?.fullName,
        requesterEmail: employeesData[1]?.personalDetails?.email,
        assignedTo: null,
        createdDate: '2024-03-11',
        updatedDate: '2024-03-11',
        dueDate: '2024-03-14',
        resolution: null,
        comments: []
      },
      {
        id: 'TKT003',
        title: 'Network connectivity issue',
        description: 'Unable to connect to company VPN from home. Getting authentication error.',
        category: 'Network',
        priority: 'High',
        status: 'Resolved',
        requesterId: employeesData[2]?.id,
        requesterName: employeesData[2]?.personalDetails?.fullName,
        requesterEmail: employeesData[2]?.personalDetails?.email,
        assignedTo: 'Network Team',
        createdDate: '2024-03-09',
        updatedDate: '2024-03-10',
        dueDate: '2024-03-11',
        resolution: 'VPN credentials reset and new configuration provided.',
        comments: [
          {
            id: 1,
            author: 'Network Team',
            message: 'Checking VPN server logs.',
            timestamp: '2024-03-09T11:00:00Z'
          },
          {
            id: 2,
            author: 'Network Team',
            message: 'Issue resolved. New VPN profile sent via email.',
            timestamp: '2024-03-10T16:30:00Z'
          }
        ]
      },
      {
        id: 'TKT004',
        title: 'Password reset request',
        description: 'Forgot my domain password. Need it reset to access company systems.',
        category: 'Account Access',
        priority: 'Low',
        status: 'Closed',
        requesterId: employeesData[3]?.id,
        requesterName: employeesData[3]?.personalDetails?.fullName,
        requesterEmail: employeesData[3]?.personalDetails?.email,
        assignedTo: 'IT Support Team',
        createdDate: '2024-03-08',
        updatedDate: '2024-03-08',
        dueDate: '2024-03-09',
        resolution: 'Password reset completed. Temporary password provided.',
        comments: [
          {
            id: 1,
            author: 'IT Support',
            message: 'Password reset completed. Please check your email.',
            timestamp: '2024-03-08T15:45:00Z'
          }
        ]
      },
      {
        id: 'TKT005',
        title: 'Email not syncing',
        description: 'Outlook is not syncing emails properly. Some emails are missing and sent items are not showing.',
        category: 'Email',
        priority: 'Medium',
        status: 'On Hold',
        requesterId: employeesData[4]?.id,
        requesterName: employeesData[4]?.personalDetails?.fullName,
        requesterEmail: employeesData[4]?.personalDetails?.email,
        assignedTo: 'Email Admin',
        createdDate: '2024-03-11',
        updatedDate: '2024-03-11',
        dueDate: '2024-03-13',
        resolution: null,
        comments: [
          {
            id: 1,
            author: 'Email Admin',
            message: 'Checking Exchange server status. Will update soon.',
            timestamp: '2024-03-11T13:20:00Z'
          }
        ]
      }
    ];

    setTickets(sampleTickets);
    saveToStorage('helpDeskTickets', sampleTickets);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || ticket.status === filterStatus;
    const matchesPriority = !filterPriority || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = tickets.filter(ticket => ticket.status === 'Open').length;
  const inProgressCount = tickets.filter(ticket => ticket.status === 'In Progress').length;
  const resolvedCount = tickets.filter(ticket => ticket.status === 'Resolved').length;
  const avgResolutionTime = '2.5 days'; // This would be calculated from actual data

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
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
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId
        ? { 
            ...ticket, 
            status: newStatus, 
            updatedDate: new Date().toISOString().split('T')[0],
            ...(newStatus === 'Resolved' && { resolution: 'Issue resolved by IT team.' })
          }
        : ticket
    );
    setTickets(updatedTickets);
    saveToStorage('helpDeskTickets', updatedTickets);
  };

  const AddTicketModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      requesterId: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.requesterId);

      const newTicket = {
        id: `TKT${String(tickets.length + 1).padStart(3, '0')}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'Open',
        requesterId: formData.requesterId,
        requesterName: selectedEmployee?.personalDetails?.fullName,
        requesterEmail: selectedEmployee?.personalDetails?.email,
        assignedTo: null,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        resolution: null,
        comments: []
      };

      const updatedTickets = [...tickets, newTicket];
      setTickets(updatedTickets);
      saveToStorage('helpDeskTickets', updatedTickets);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        requesterId: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Create New Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Ticket Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={4}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <select
                value={formData.requesterId}
                onChange={(e) => setFormData({...formData, requesterId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Requester</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.personalDetails?.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Desk & Ticketing</h1>
          <p className="text-gray-600 mt-1">Manage IT support tickets and requests</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{openCount}</p>
              <p className="text-gray-600 text-sm">Open Tickets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              <p className="text-gray-600 text-sm">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
              <p className="text-gray-600 text-sm">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{avgResolutionTime}</p>
              <p className="text-gray-600 text-sm">Avg Resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {ticketStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No tickets found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500">#{ticket.id} • {ticket.category}</div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(ticket.createdDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{ticket.requesterName}</div>
                          <div className="text-sm text-gray-500">{ticket.requesterEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(ticket.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {ticketStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTicketModal />
    </div>
  );
};

export default HelpDeskTicketing;