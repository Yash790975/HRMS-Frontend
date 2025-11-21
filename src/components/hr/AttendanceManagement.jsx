// import React, { useState, useEffect } from 'react';
// import { Clock, Calendar, Users, TrendingUp, Plus, Search, Filter } from 'lucide-react';
// import { getFromStorage, saveToStorage } from '../../utils/localStorage';
// import { formatDate } from '../../utils/helpers';
// import { ATTENDANCE_STATUS } from '../../utils/constants';

// const AttendanceManagement = () => {
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = () => {
//     const employeesData = getFromStorage('employees') || [];
//     const attendanceData = getFromStorage('attendance') || [];
    
//     setEmployees(employeesData);
//     setAttendanceRecords(attendanceData);

//     // Generate sample attendance data if none exists
//     if (attendanceData.length === 0 && employeesData.length > 0) {
//       generateSampleAttendance(employeesData);
//     }
//   };

//   const generateSampleAttendance = (employeesData) => {
//     const sampleAttendance = [];
//     const today = new Date();
    
//     // Generate attendance for last 30 days
//     for (let i = 0; i < 30; i++) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toISOString().split('T')[0];
      
//       employeesData.forEach(employee => {
//         const statuses = Object.values(ATTENDANCE_STATUS);
//         const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
//         sampleAttendance.push({
//           id: `ATT${Date.now()}${Math.random()}`,
//           employeeId: employee.id,
//           employeeName: employee.personalDetails?.fullName,
//           date: dateStr,
//           status: randomStatus,
//           checkIn: randomStatus === 'Present' ? '09:00' : null,
//           checkOut: randomStatus === 'Present' ? '18:00' : null,
//           workingHours: randomStatus === 'Present' ? 9 : 0,
//           createdAt: new Date().toISOString()
//         });
//       });
//     }
    
//     setAttendanceRecords(sampleAttendance);
//     saveToStorage('attendance', sampleAttendance);
//   };

//   const todayAttendance = attendanceRecords.filter(record => record.date === selectedDate);
//   const presentCount = todayAttendance.filter(record => record.status === 'Present').length;
//   const absentCount = todayAttendance.filter(record => record.status === 'Absent').length;
//   const lateCount = todayAttendance.filter(record => record.status === 'Late').length;

//   const filteredAttendance = todayAttendance.filter(record => {
//     const matchesSearch = !searchTerm || 
//       record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = !filterStatus || record.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Present': 'bg-emerald-100 text-emerald-800',
//       'Absent': 'bg-red-100 text-red-800',
//       'Half Day': 'bg-amber-100 text-amber-800',
//       'Late': 'bg-orange-100 text-orange-800',
//       'Work From Home': 'bg-blue-100 text-blue-800'
//     };

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
//           <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
//         </div>
//         <div className="mt-4 sm:mt-0 flex items-center space-x-3">
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//           <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200">
//             <Plus className="w-4 h-4 mr-2" />
//             Mark Attendance
//           </button>
//         </div>
//       </div>
  
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
//               <p className="text-gray-600 text-sm">Present Today</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
//               <p className="text-gray-600 text-sm">Absent Today</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
//               <Clock className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
//               <p className="text-gray-600 text-sm">Late Today</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">
//                 {todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0}%
//               </p>
//               <p className="text-gray-600 text-sm">Attendance Rate</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           >
//             <option value="">All Status</option>
//             {Object.values(ATTENDANCE_STATUS).map(status => (
//               <option key={status} value={status}>{status}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Attendance Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Attendance for {formatDate(selectedDate)}
//           </h2>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check In
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check Out
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Working Hours
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredAttendance.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
//                     <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-lg font-medium">No attendance records found</p>
//                     <p className="text-sm">Select a different date or check your filters</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredAttendance.map((record) => (
//                   <tr key={record.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {record.employeeName}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(record.status)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {record.checkIn || '-'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {record.checkOut || '-'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {record.workingHours ? `${record.workingHours}h` : '-'}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceManagement;



import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Users, TrendingUp, Plus, Search, Filter, X, Check } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';
import { ATTENDANCE_STATUS } from '../../utils/constants';

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const attendanceData = getFromStorage('attendance') || [];
    
    setEmployees(employeesData);
    setAttendanceRecords(attendanceData);

    // Generate sample attendance data if none exists
    if (attendanceData.length === 0 && employeesData.length > 0) {
      generateSampleAttendance(employeesData);
    }
  };

  const generateSampleAttendance = (employeesData) => {
    const sampleAttendance = [];
    const today = new Date();
    
    // Generate attendance for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      employeesData.forEach(employee => {
        const statuses = Object.values(ATTENDANCE_STATUS);
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        sampleAttendance.push({
          id: `ATT${Date.now()}${Math.random()}`,
          employeeId: employee.id,
          employeeName: employee.personalDetails?.fullName,
          date: dateStr,
          status: randomStatus,
          checkIn: randomStatus === 'Present' ? '09:00' : null,
          checkOut: randomStatus === 'Present' ? '18:00' : null,
          workingHours: randomStatus === 'Present' ? 9 : 0,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    setAttendanceRecords(sampleAttendance);
    saveToStorage('attendance', sampleAttendance);
  };

  const openMarkAttendanceModal = () => {
    setShowMarkAttendanceModal(true);
    setSelectedEmployeeId('');
    setAttendanceStatus('Present');
    setCheckInTime('09:00');
    setCheckOutTime('18:00');
  };

  const closeMarkAttendanceModal = () => {
    setShowMarkAttendanceModal(false);
    setSelectedEmployeeId('');
    setAttendanceStatus('Present');
    setCheckInTime('');
    setCheckOutTime('');
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const [checkInHour, checkInMinute] = checkIn.split(':').map(Number);
    const [checkOutHour, checkOutMinute] = checkOut.split(':').map(Number);
    
    const checkInMinutes = checkInHour * 60 + checkInMinute;
    const checkOutMinutes = checkOutHour * 60 + checkOutMinute;
    
    const workingMinutes = checkOutMinutes - checkInMinutes;
    return Math.max(0, Math.round(workingMinutes / 60 * 100) / 100);
  };

  const markAttendance = () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee');
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) {
      alert('Selected employee not found');
      return;
    }

    // Check if attendance already exists for this employee on selected date
    const existingAttendance = attendanceRecords.find(
      record => record.employeeId === selectedEmployeeId && record.date === selectedDate
    );

    if (existingAttendance) {
      alert('Attendance already marked for this employee on the selected date');
      return;
    }

    const workingHours = calculateWorkingHours(checkInTime, checkOutTime);

    const newAttendanceRecord = {
      id: `ATT${Date.now()}${Math.random()}`,
      employeeId: selectedEmployeeId,
      employeeName: selectedEmployee.personalDetails?.fullName || selectedEmployee.name,
      date: selectedDate,
      status: attendanceStatus,
      checkIn: (attendanceStatus === 'Present' || attendanceStatus === 'Late') ? checkInTime : null,
      checkOut: (attendanceStatus === 'Present' || attendanceStatus === 'Late') && checkOutTime ? checkOutTime : null,
      workingHours: (attendanceStatus === 'Present' || attendanceStatus === 'Late') ? workingHours : 0,
      createdAt: new Date().toISOString()
    };

    const updatedAttendance = [...attendanceRecords, newAttendanceRecord];
    setAttendanceRecords(updatedAttendance);
    saveToStorage('attendance', updatedAttendance);

    closeMarkAttendanceModal();
    alert('Attendance marked successfully!');
  };

  const todayAttendance = attendanceRecords.filter(record => record.date === selectedDate);
  const presentCount = todayAttendance.filter(record => record.status === 'Present').length;
  const absentCount = todayAttendance.filter(record => record.status === 'Absent').length;
  const lateCount = todayAttendance.filter(record => record.status === 'Late').length;

  const filteredAttendance = todayAttendance.filter(record => {
    const matchesSearch = !searchTerm || 
      record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      'Present': 'bg-emerald-100 text-emerald-800',
      'Absent': 'bg-red-100 text-red-800',
      'Half Day': 'bg-amber-100 text-amber-800',
      'Late': 'bg-orange-100 text-orange-800',
      'Work From Home': 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button 
            onClick={openMarkAttendanceModal}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Mark Attendance
          </button>
        </div>
      </div>
  
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              <p className="text-gray-600 text-sm">Present Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
              <p className="text-gray-600 text-sm">Absent Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
              <p className="text-gray-600 text-sm">Late Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0}%
              </p>
              <p className="text-gray-600 text-sm">Attendance Rate</p>
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
                placeholder="Search employees..."
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
            {Object.values(ATTENDANCE_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance for {formatDate(selectedDate)}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No attendance records found</p>
                    <p className="text-sm">Select a different date or check your filters</p>
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.employeeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkIn || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkOut || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.workingHours ? `${record.workingHours}h` : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mark Attendance</h2>
              <button
                onClick={closeMarkAttendanceModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.personalDetails?.fullName || employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {Object.values(ATTENDANCE_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {(attendanceStatus === 'Present' || attendanceStatus === 'Late') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check In Time
                    </label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check Out Time
                    </label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeMarkAttendanceModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={markAttendance}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;