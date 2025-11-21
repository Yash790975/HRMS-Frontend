import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, Calendar, User, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const savedNotifications = JSON.parse(localStorage.getItem('hrms_notifications') || '[]');
      if (savedNotifications.length === 0) {
        // Add sample notifications
        const sampleNotifications = [
          {
            id: 1,
            type: 'leave_request',
            title: 'Leave Request Pending',
            message: 'John Doe has requested leave from Jan 20-22, 2024',
            read: false,
            timestamp: '2024-01-18T10:30:00Z',
            action: 'approval',
            relatedId: 1
          },
          {
            id: 2,
            type: 'timesheet',
            title: 'Timesheet Submitted',
            message: 'Sarah Smith has submitted her timesheet for week Jan 15-21',
            read: false,
            timestamp: '2024-01-17T14:15:00Z',
            action: 'review',
            relatedId: 2
          },
          {
            id: 3,
            type: 'expense',
            title: 'Expense Claim Submitted',
            message: 'Mike Johnson submitted expense claim for $245.50',
            read: true,
            timestamp: '2024-01-16T09:20:00Z',
            action: 'approval',
            relatedId: 3
          },
          {
            id: 4,
            type: 'hr_announcement',
            title: 'New Company Policy',
            message: 'Updated remote work policy effective Feb 1, 2024',
            read: false,
            timestamp: '2024-01-15T11:45:00Z',
            action: 'info',
            relatedId: null
          },
          {
            id: 5,
            type: 'attendance',
            title: 'Attendance Regularization',
            message: 'Emily Davis requested attendance regularization for Jan 17',
            read: true,
            timestamp: '2024-01-14T16:30:00Z',
            action: 'approval',
            relatedId: 4
          }
        ];
        localStorage.setItem('hrms_notifications', JSON.stringify(sampleNotifications));
        setNotifications(sampleNotifications);
      } else {
        setNotifications(savedNotifications);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('hrms_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, read: true })
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('hrms_notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => 
      notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('hrms_notifications', JSON.stringify(updatedNotifications));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'leave_request':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'timesheet':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'expense':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'hr_announcement':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'attendance':
        return <User className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'leave_request':
        return 'bg-orange-100 text-orange-800';
      case 'timesheet':
        return 'bg-blue-100 text-blue-800';
      case 'expense':
        return 'bg-green-100 text-green-800';
      case 'hr_announcement':
        return 'bg-purple-100 text-purple-800';
      case 'attendance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'approvals':
        return notification.action === 'approval';
      case 'announcements':
        return notification.type === 'hr_announcement';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Notifications</h1>
            <p className="text-orange-100">Stay updated with important team activities and approvals</p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="approvals">Pending Approvals</option>
              <option value="announcements">Announcements</option>
            </select>
            <span className="text-sm text-gray-600">
              {filteredNotifications.length} notifications
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 ${
              !notification.read ? 'border-l-4 border-l-orange-500' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{notification.message}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  
                  <div className="flex space-x-2">
                    {notification.action === 'approval' && (
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                        Approve
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications found</h3>
          <p className="text-gray-600">You're all caught up! No new notifications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;