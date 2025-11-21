import React, { useState } from 'react';
import { HelpCircle, Send, Paperclip, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const SubmitTicket = () => {
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    category: 'it-support',
    priority: 'medium',
    subject: '',
    description: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  // Mock existing tickets
  const [tickets] = useState([
    {
      id: 'TK-001',
      subject: 'Laptop running slowly',
      category: 'it-support',
      priority: 'medium',
      status: 'in-progress',
      createdDate: '2024-01-15',
      lastUpdate: '2024-01-16',
      assignedTo: 'IT Support Team'
    },
    {
      id: 'TK-002',
      subject: 'Request for new software license',
      category: 'software-request',
      priority: 'low',
      status: 'pending',
      createdDate: '2024-01-10',
      lastUpdate: '2024-01-10',
      assignedTo: 'IT Procurement'
    },
    {
      id: 'TK-003',
      subject: 'Cannot access shared drive',
      category: 'access-issue',
      priority: 'high',
      status: 'resolved',
      createdDate: '2024-01-08',
      lastUpdate: '2024-01-09',
      assignedTo: 'Network Admin',
      resolvedDate: '2024-01-09'
    }
  ]);

  const categories = [
    { value: 'it-support', label: 'IT Support' },
    { value: 'hr-inquiry', label: 'HR Inquiry' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'software-request', label: 'Software Request' },
    { value: 'hardware-request', label: 'Hardware Request' },
    { value: 'access-issue', label: 'Access Issue' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-800' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      addNotification({
        title: 'Ticket Submitted',
        message: `Your support ticket "${formData.subject}" has been submitted successfully.`,
        type: 'success'
      });

      // Reset form
      setFormData({
        category: 'it-support',
        priority: 'medium',
        subject: '',
        description: '',
        attachments: []
      });

    } catch (error) {
      addNotification({
        title: 'Submission Failed',
        message: 'There was an error submitting your ticket. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'text-gray-600';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Desk</h1>
          <p className="text-gray-600">Submit a support ticket or view your existing tickets</p>
        </div>
        <button
          onClick={() => setShowTickets(!showTickets)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          {showTickets ? 'Submit New Ticket' : 'View My Tickets'}
        </button>
      </div>

      {!showTickets ? (
        /* Submit Ticket Form */
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <HelpCircle className="h-8 w-8 text-orange-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Submit Support Ticket</h2>
                <p className="text-gray-600">Describe your issue and we'll help you resolve it</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  placeholder="Please provide detailed information about your issue, including any error messages, steps to reproduce, and what you've already tried..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Attach screenshots, error logs, or other relevant files
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx,.log"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="attachment-upload"
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 10MB per file. Supported: Images, PDF, DOC, TXT, LOG
                  </p>
                </div>

                {/* Uploaded Attachments */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Attached Files</h4>
                    {formData.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* My Tickets View */
        <div className="space-y-6">
          {/* Tickets Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                </div>
                <HelpCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {tickets.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {tickets.filter(t => t.status === 'in-progress').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tickets.filter(t => t.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Support Tickets</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                        <span className="text-sm text-gray-500">#{ticket.id}</span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span>Category: <span className="font-medium">{categories.find(c => c.value === ticket.category)?.label}</span></span>
                        <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                          Priority: {priorities.find(p => p.value === ticket.priority)?.label}
                        </span>
                        <span>Assigned to: <span className="font-medium">{ticket.assignedTo}</span></span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                        <span>Last Update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                        {ticket.resolvedDate && (
                          <span>Resolved: {new Date(ticket.resolvedDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                        View Details
                      </button>
                      {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Add Comment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitTicket;