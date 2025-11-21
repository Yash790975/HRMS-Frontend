// import React from 'react';
// import { Clock, Calendar, TrendingUp, MapPin } from 'lucide-react';

// const AttendanceSection = () => {
//   const attendanceData = {
//     todayStatus: 'Checked In',
//     checkInTime: '09:00 AM',
//     workingHours: '8h 30m',
//     thisWeek: {
//       present: 4,
//       total: 5,
//       percentage: 80
//     },
//     thisMonth: {
//       present: 18,
//       total: 22,
//       percentage: 82
//     }
//   };

//   const recentAttendance = [
//     { date: '2025-06-16', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '8h 15m', status: 'Present' },
//     { date: '2025-06-15', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '8h 00m', status: 'Present' },
//     { date: '2025-06-14', checkIn: '09:30 AM', checkOut: '06:45 PM', hours: '8h 15m', status: 'Late' },
//     { date: '2025-06-13', checkIn: '08:45 AM', checkOut: '05:45 PM', hours: '8h 00m', status: 'Present' }
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
//         <Clock className="h-5 w-5 text-orange-600" />
//       </div>

//       {/* Current Status */}
//       <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="font-semibold text-green-800">Today's Status</h3>
//             <p className="text-green-600 text-sm">Currently working</p>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-green-700">{attendanceData.todayStatus}</p>
//             <p className="text-green-600 text-sm">Since {attendanceData.checkInTime}</p>
//           </div>
//         </div>
//         <div className="mt-3 flex items-center text-green-600">
//           <MapPin className="h-4 w-4 mr-1" />
//           <span className="text-sm">Working hours: {attendanceData.workingHours}</span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-gray-50 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">This Week</p>
//               <p className="text-xl font-bold text-gray-900">{attendanceData.thisWeek.present}/{attendanceData.thisWeek.total}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-medium text-blue-600">{attendanceData.thisWeek.percentage}%</p>
//               <TrendingUp className="h-4 w-4 text-blue-600 inline" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-gray-50 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">This Month</p>
//               <p className="text-xl font-bold text-gray-900">{attendanceData.thisMonth.present}/{attendanceData.thisMonth.total}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-medium text-purple-600">{attendanceData.thisMonth.percentage}%</p>
//               <Calendar className="h-4 w-4 text-purple-600 inline" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Attendance */}
//       <div>
//         <h3 className="font-medium text-gray-900 mb-3">Recent Attendance</h3>
//         <div className="space-y-2">
//           {recentAttendance.map((record, index) => (
//             <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="text-sm">
//                   <p className="font-medium text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4 text-sm">
//                 <span className="text-gray-600">{record.checkIn} - {record.checkOut}</span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   record.status === 'Present' ? 'bg-green-100 text-green-800' :
//                   record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {record.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>     
//     </div>
//   );
// };

// export default AttendanceSection; 
import React from 'react';
import { Clock, Calendar, TrendingUp, MapPin, Play, Square } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';

const AttendanceSection = () => {
  const { attendanceRecords, currentStatus, todayRecord, checkIn, checkOut } = useAttendance();

  const handleAttendanceToggle = () => {
    if (currentStatus === 'out') {
      checkIn();
    } else {
      checkOut();
    }
  };

  // Calculate this month's statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });

  const totalHoursThisMonth = thisMonthRecords.reduce((total, record) => total + record.totalHours, 0);
  const presentDays = thisMonthRecords.length;
  const workingDaysThisMonth = 22; // Assuming 22 working days per month
  const attendancePercentage = Math.round((presentDays / workingDaysThisMonth) * 100);

  const recentAttendance = attendanceRecords.slice(-4).reverse();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
        <Clock className="h-5 w-5 text-orange-600" />
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Today's Status</h3>
            <p className="text-green-600 text-sm">
              {currentStatus === 'in' ? 'Currently working' : 'Not at work'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">
              {currentStatus === 'in' ? 'Checked In' : 'Checked Out'}
            </p>
            {todayRecord?.checkIn && (
              <p className="text-green-600 text-sm">Since {todayRecord.checkIn}</p>
            )}
          </div>
        </div>
        
        {currentStatus === 'in' && todayRecord && (
          <div className="mt-3 flex items-center text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              Working time: {Math.floor((new Date() - new Date()) / (1000 * 60 * 60))}h {Math.floor(((new Date() - new Date()) / (1000 * 60)) % 60)}m
            </span>
          </div>
        )}

        {/* Quick Check In/Out Button */}
        <div className="mt-4">
          <button
            onClick={handleAttendanceToggle}
            className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm ${
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-900">{presentDays}/{workingDaysThisMonth}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">{attendancePercentage}%</p>
              <TrendingUp className="h-4 w-4 text-blue-600 inline" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-xl font-bold text-gray-900">{totalHoursThisMonth.toFixed(1)}h</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-purple-600">
                {thisMonthRecords.length > 0 ? (totalHoursThisMonth / thisMonthRecords.length).toFixed(1) : 0}h
              </p>
              <Calendar className="h-4 w-4 text-purple-600 inline" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Recent Attendance</h3>
        <div className="space-y-2">
          {recentAttendance.map((record, index) => (
            <div key={record.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">{record.checkIn} - {record.checkOut || 'Present'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === 'present' ? 'bg-green-100 text-green-800' :
                  record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {record.status || 'Present'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {recentAttendance.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No attendance records yet</p>
          </div>
        )}
      </div>     
    </div>
  );
};

export default AttendanceSection;