import React, { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('out');
  const [todayRecord, setTodayRecord] = useState(null);

  useEffect(() => {
    const savedRecords = localStorage.getItem('employee_attendance');
    const savedStatus = localStorage.getItem('employee_current_status');
    const savedTodayRecord = localStorage.getItem('employee_today_record');

    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    } else {
      // Initialize with sample data
      const sampleRecords = [
        {
          id: '1',
          date: '2024-01-15',
          checkIn: '09:00',
          checkOut: '17:30',
          breakTime: 60,
          totalHours: 7.5,
          status: 'present'
        },
        {
          id: '2',
          date: '2024-01-16',
          checkIn: '08:45',
          checkOut: '17:15',
          breakTime: 45,
          totalHours: 7.75,
          status: 'present'
        }
      ];
      setAttendanceRecords(sampleRecords);
      localStorage.setItem('employee_attendance', JSON.stringify(sampleRecords));
    }

    if (savedStatus) {
      setCurrentStatus(savedStatus);
    }

    if (savedTodayRecord) {
      setTodayRecord(JSON.parse(savedTodayRecord));
    }
  }, []);

  const checkIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const dateString = now.toISOString().split('T')[0];

    const newRecord = {
      id: Date.now().toString(),
      date: dateString,
      checkIn: timeString,
      checkOut: null,
      breakTime: 0,
      totalHours: 0,
      status: 'present'
    };

    setCurrentStatus('in');
    setTodayRecord(newRecord);
    localStorage.setItem('employee_current_status', 'in');
    localStorage.setItem('employee_today_record', JSON.stringify(newRecord));
  };

  const checkOut = () => {
    if (!todayRecord) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    const checkInTime = new Date(`1970-01-01T${todayRecord.checkIn}:00`);
    const checkOutTime = new Date(`1970-01-01T${timeString}:00`);
    const diffMs = checkOutTime - checkInTime;
    const totalHours = (diffMs / (1000 * 60 * 60)) - (todayRecord.breakTime / 60);

    const updatedRecord = {
      ...todayRecord,
      checkOut: timeString,
      totalHours: Math.round(totalHours * 100) / 100
    };

    const updatedRecords = [updatedRecord, ...attendanceRecords];
    setAttendanceRecords(updatedRecords);
    setCurrentStatus('out');
    setTodayRecord(null);

    localStorage.setItem('employee_attendance', JSON.stringify(updatedRecords));
    localStorage.setItem('employee_current_status', 'out');
    localStorage.removeItem('employee_today_record');
  };

  const takeBreak = (minutes) => {
    if (!todayRecord) return;

    const updatedRecord = {
      ...todayRecord,
      breakTime: todayRecord.breakTime + minutes
    };

    setTodayRecord(updatedRecord);
    localStorage.setItem('employee_today_record', JSON.stringify(updatedRecord));
  };

  const value = {
    attendanceRecords,
    currentStatus,
    todayRecord,
    checkIn,
    checkOut,
    takeBreak
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};