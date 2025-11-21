import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('employee_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const sampleNotifications = [
        {
          id: '1',
          title: 'Leave Request Approved',
          message: 'Your vacation request for Jan 15-17 has been approved.',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'New Task Assigned',
          message: 'You have been assigned a new task: Database optimization',
          type: 'info',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('employee_notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('employee_notifications', JSON.stringify(updatedNotifications));
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('employee_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('employee_notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('employee_notifications', JSON.stringify(updatedNotifications));
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};