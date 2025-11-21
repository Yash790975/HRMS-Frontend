import React, { createContext, useContext, useState, useEffect } from 'react';

const LeaveContext = createContext();

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    vacation: { total: 20, used: 8, remaining: 12 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 5, used: 1, remaining: 4 },
    maternity: { total: 90, used: 0, remaining: 90 }
  });

  useEffect(() => {
    const savedLeaves = localStorage.getItem('employee_leaves');
    const savedBalance = localStorage.getItem('employee_leave_balance');
    
    if (savedLeaves) {
      setLeaves(JSON.parse(savedLeaves));
    } else {
      // Initialize with some sample leaves
      const sampleLeaves = [
        {
          id: '1',
          type: 'vacation',
          startDate: '2024-01-15',
          endDate: '2024-01-17',
          days: 3,
          reason: 'Family vacation',
          status: 'approved',
          appliedDate: '2024-01-01',
          approvedBy: 'Jane Smith'
        },
        {
          id: '2',
          type: 'sick',
          startDate: '2024-02-10',
          endDate: '2024-02-10',
          days: 1,
          reason: 'Medical appointment',
          status: 'pending',
          appliedDate: '2024-02-08'
        }
      ];
      setLeaves(sampleLeaves);
      localStorage.setItem('employee_leaves', JSON.stringify(sampleLeaves));
    }

    if (savedBalance) {
      setLeaveBalance(JSON.parse(savedBalance));
    } else {
      localStorage.setItem('employee_leave_balance', JSON.stringify(leaveBalance));
    }
  }, []);

  const applyLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: Date.now().toString(),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    const updatedLeaves = [newLeave, ...leaves];
    setLeaves(updatedLeaves);
    localStorage.setItem('employee_leaves', JSON.stringify(updatedLeaves));

    return newLeave;
  };

  const cancelLeave = (leaveId) => {
    const updatedLeaves = leaves.map(leave =>
      leave.id === leaveId ? { ...leave, status: 'cancelled' } : leave
    );
    setLeaves(updatedLeaves);
    localStorage.setItem('employee_leaves', JSON.stringify(updatedLeaves));
  };

  const updateLeaveBalance = (newBalance) => {
    setLeaveBalance(newBalance);
    localStorage.setItem('employee_leave_balance', JSON.stringify(newBalance));
  };

  const value = {
    leaves,
    leaveBalance,
    applyLeave,
    cancelLeave,
    updateLeaveBalance
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};