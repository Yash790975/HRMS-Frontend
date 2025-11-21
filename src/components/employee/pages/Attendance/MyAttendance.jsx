import React, { useState } from 'react';
import { Clock, Calendar, TrendingUp, Play, Square } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';

const MyAttendance = () => {
  const { attendanceRecords, currentStatus, todayRecord, checkIn, checkOut, takeBreak } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleAttendanceToggle = () => {
    if (currentStatus === 'out') {
      checkIn();
    } else {
      checkOut();
    }
  };

  const handleBreak = (minutes) => {
    takeBreak(minutes);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  const totalHoursThisMonth = filteredRecords.reduce((total, record) => total + record.totalHours, 0);
  const averageHoursPerDay = filteredRecords.length > 0 ? totalHoursThisMonth / filteredRecords.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600">Track your work hours and attendance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Check In/Out */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Clock In/Out</h3>
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Status: <span className={`font-medium ${currentStatus === 'in' ? 'text-green-600' : 'text-gray-600'}`}>
                {currentStatus === 'in' ? 'Checked In' : 'Checked Out'}
              </span>
            </p>
            
            <button
              onClick={handleAttendanceToggle}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                currentStatus === 'out'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {currentStatus === 'out' ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Check In</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  <span>Check Out</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          
          {todayRecord ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check In:</span>
                <span className="font-medium">{todayRecord.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Break Time:</span>
                <span className="font-medium">{todayRecord.breakTime} min</span>
              </div>
              {todayRecord.checkOut && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Check Out:</span>
                  <span className="font-medium">{todayRecord.checkOut}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No attendance recorded today</p>
          )}
        </div>

        {/* Break Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Break Time</h3>
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          
          {currentStatus === 'in' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Take a break:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleBreak(15)}
                  className="py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm"
                >
                  15 min
                </button>
                <button
                  onClick={() => handleBreak(30)}
                  className="py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm"
                >
                  30 min
                </button>
                <button
                  onClick={() => handleBreak(45)}
                  className="py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm"
                >
                  45 min
                </button>
                <button
                  onClick={() => handleBreak(60)}
                  className="py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm"
                >
                  1 hour
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">Check in to manage breaks</p>
          )}
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Hours</h3>
          <p className="text-3xl font-bold text-orange-600">{totalHoursThisMonth.toFixed(1)}</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Hours</h3>
          <p className="text-3xl font-bold text-green-600">{averageHoursPerDay.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Per day</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Days Present</h3>
          <p className="text-3xl font-bold text-purple-600">{filteredRecords.length}</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Break Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.checkIn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.checkOut || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.breakTime} min</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.totalHours} hrs</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
            <p className="text-gray-500">No attendance records found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;