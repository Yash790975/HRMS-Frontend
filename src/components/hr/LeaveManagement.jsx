// import React, { useState, useEffect } from 'react';
// import { Calendar, Plus, Search, Filter, Check, X, Clock, User } from 'lucide-react';
// import { getFromStorage, saveToStorage } from '../../utils/localStorage';
// import { formatDate } from '../../utils/helpers';
// import { LEAVE_TYPES, LEAVE_STATUS } from '../../utils/constants';

// const LeaveManagement = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);

//   useEffect(() => {
//     loadData(); 
//   }, []);

//   const loadData = () => {
//     const employeesData = getFromStorage('employees') || [];
//     const leaveData = getFromStorage('leaveRequests') || [];
    
//     setEmployees(employeesData);
//     setLeaveRequests(leaveData);

//     // Generate sample leave requests if none exist
//     if (leaveData.length === 0 && employeesData.length > 0) {
//       generateSampleLeaveRequests(employeesData);
//     }
//   };

//   const generateSampleLeaveRequests = (employeesData) => {
//     // const sampleLeaves = [
//     //   {
//     //     id: 'LV001',
//     //     employeeId: employeesData[0]?.id,
//     //     employeeName: employeesData[0]?.personalDetails?.fullName,
//     //     leaveType: 'Annual Leave',
//     //     startDate: '2024-02-15',
//     //     endDate: '2024-02-17',
//     //     days: 3,
//     //     reason: 'Family vacation',
//     //     status: 'Pending',
//     //     appliedDate: '2024-02-01',
//     //     approvedBy: null,
//     //     approvedDate: null
//     //   },
//     //   {
//     //     id: 'LV002',
//     //     employeeId: employeesData[1]?.id,
//     //     employeeName: employeesData[1]?.personalDetails?.fullName,
//     //     leaveType: 'Sick Leave',
//     //     startDate: '2024-02-10',
//     //     endDate: '2024-02-12',
//     //     days: 3,
//     //     reason: 'Medical treatment',
//     //     status: 'Approved',
//     //     appliedDate: '2024-02-08',
//     //     approvedBy: 'HR Manager',
//     //     approvedDate: '2024-02-09'
//     //   },
//     //   {
//     //     id: 'LV003',
//     //     employeeId: employeesData[2]?.id,
//     //     employeeName: employeesData[2]?.personalDetails?.fullName,
//     //     leaveType: 'Casual Leave',
//     //     startDate: '2024-02-20',
//     //     endDate: '2024-02-20',
//     //     days: 1,
//     //     reason: 'Personal work',
//     //     status: 'Rejected',
//     //     appliedDate: '2024-02-18',
//     //     approvedBy: 'HR Manager',
//     //     approvedDate: '2024-02-19'
//     //   }
//     // ];

//     setLeaveRequests(sampleLeaves);
//     saveToStorage('leaveRequests', sampleLeaves);
//   };

//   const filteredLeaves = leaveRequests.filter(leave => {
//     const matchesSearch = !searchTerm || 
//       leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = !filterStatus || leave.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const pendingCount = leaveRequests.filter(leave => leave.status === 'Pending').length;
//   const approvedCount = leaveRequests.filter(leave => leave.status === 'Approved').length;
//   const rejectedCount = leaveRequests.filter(leave => leave.status === 'Rejected').length;

//   const handleApproveLeave = (leaveId) => {
//     const updatedLeaves = leaveRequests.map(leave =>
//       leave.id === leaveId
//         ? { ...leave, status: 'Approved', approvedBy: 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] }
//         : leave
//     );
//     setLeaveRequests(updatedLeaves);
//     saveToStorage('leaveRequests', updatedLeaves);
//   };

//   const handleRejectLeave = (leaveId) => {
//     const updatedLeaves = leaveRequests.map(leave =>
//       leave.id === leaveId
//         ? { ...leave, status: 'Rejected', approvedBy: 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] }
//         : leave
//     );
//     setLeaveRequests(updatedLeaves);
//     saveToStorage('leaveRequests', updatedLeaves);
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Pending': 'bg-amber-100 text-amber-800',
//       'Approved': 'bg-emerald-100 text-emerald-800',
//       'Rejected': 'bg-red-100 text-red-800',
//       'Cancelled': 'bg-gray-100 text-gray-800'
//     };

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };

//   const AddLeaveModal = () => {
//     const [formData, setFormData] = useState({
//       employeeId: '',
//       leaveType: '',
//       startDate: '',
//       endDate: '',
//       reason: ''
//     });

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);
//       const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

//       const newLeave = {
//         id: `LV${Date.now()}`,
//         employeeId: formData.employeeId,
//         employeeName: selectedEmployee?.personalDetails?.fullName,
//         leaveType: formData.leaveType,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         days: days,
//         reason: formData.reason,
//         status: 'Pending',
//         appliedDate: new Date().toISOString().split('T')[0],
//         approvedBy: null,
//         approvedDate: null
//       };

//       const updatedLeaves = [...leaveRequests, newLeave];
//       setLeaveRequests(updatedLeaves);
//       saveToStorage('leaveRequests', updatedLeaves);
//       setShowAddModal(false);
//       setFormData({
//         employeeId: '',
//         leaveType: '',
//         startDate: '',
//         endDate: '',
//         reason: ''
//       });
//     };

//     if (!showAddModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 w-full max-w-md">
//           <h3 className="text-lg font-semibold mb-4">Add Leave Request</h3>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <select
//               value={formData.employeeId}
//               onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//             >
//               <option value="">Select Employee</option>
//               {employees.map(emp => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.personalDetails?.fullName}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={formData.leaveType}
//               onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//             >
//               <option value="">Select Leave Type</option>
//               {LEAVE_TYPES.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//             <input
//               type="date"
//               value={formData.startDate}
//               onChange={(e) => setFormData({...formData, startDate: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//             />
//             <input
//               type="date"
//               value={formData.endDate}
//               onChange={(e) => setFormData({...formData, endDate: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               required
//             />
//             <textarea
//               placeholder="Reason for leave"
//               value={formData.reason}
//               onChange={(e) => setFormData({...formData, reason: e.target.value})}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//               rows={3}
//               required
//             />
//             <div className="flex space-x-3">
//               <button
//                 type="submit"
//                 className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
//               >
//                 Add Leave Request
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowAddModal(false)}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
//           <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Leave Request
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
//               <Clock className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
//               <p className="text-gray-600 text-sm">Pending Requests</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
//               <Check className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
//               <p className="text-gray-600 text-sm">Approved</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
//               <X className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
//               <p className="text-gray-600 text-sm">Rejected</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
//               <Calendar className="w-6 h-6 text-white" />
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
//               <p className="text-gray-600 text-sm">Total Requests</p>
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
//                 placeholder="Search leave requests..."
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
//             {Object.values(LEAVE_STATUS).map(status => (
//               <option key={status} value={status}>{status}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Leave Requests Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Leave Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Duration
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredLeaves.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
//                     <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-lg font-medium">No leave requests found</p>
//                     <p className="text-sm">Try adjusting your search or filters</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLeaves.map((leave) => (
//                   <tr key={leave.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                           <User className="w-5 h-5 text-orange-600" />
//                           {/* {emp.personalDetails?.fullName} */}
//                           {/* {employees.map(emp => (
//                             <option key={emp.id} value={emp.id}>
//                               {emp.personalDetails?.fullName}
//                             </option>
//                           ))} */}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {leave.employeeName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Applied: {formatDate(leave.appliedDate)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{leave.leaveType}</div>
//                       <div className="text-sm text-gray-500">{leave.reason}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
//                       </div>
//                       <div className="text-sm text-gray-500">{leave.days} day(s)</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(leave.status)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {leave.status === 'Pending' && (
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleApproveLeave(leave.id)}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
//                             title="Approve"
//                           >
//                             <Check className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleRejectLeave(leave.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                             title="Reject"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <AddLeaveModal />
//     </div>
//   );
// };

// export default LeaveManagement;

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Check, X, Clock, User } from 'lucide-react';
import { getFromStorage, saveToStorage } from '../../utils/localStorage';
import { formatDate } from '../../utils/helpers';
import { LEAVE_TYPES, LEAVE_STATUS } from '../../utils/constants';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData(); 
  }, []);

  const loadData = () => {
    const employeesData = getFromStorage('employees') || [];
    const leaveData = getFromStorage('leaveRequests') || [];
    
    // Clear any existing demo data
    const cleanLeaveData = leaveData.filter(leave => 
      !leave.id.startsWith('LV00') // Remove demo entries with IDs like LV001, LV002, LV003
    );
    
    setEmployees(employeesData);
    setLeaveRequests(cleanLeaveData);
    
    // Save the cleaned data back to localStorage
    if (cleanLeaveData.length !== leaveData.length) {
      saveToStorage('leaveRequests', cleanLeaveData);
    }
  };

  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = !searchTerm || 
      leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaveRequests.filter(leave => leave.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(leave => leave.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(leave => leave.status === 'Rejected').length;

  const handleApproveLeave = (leaveId) => {
    const updatedLeaves = leaveRequests.map(leave =>
      leave.id === leaveId
        ? { ...leave, status: 'Approved', approvedBy: 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] }
        : leave
    );
    setLeaveRequests(updatedLeaves);
    saveToStorage('leaveRequests', updatedLeaves);
  };

  const handleRejectLeave = (leaveId) => {
    const updatedLeaves = leaveRequests.map(leave =>
      leave.id === leaveId
        ? { ...leave, status: 'Rejected', approvedBy: 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] }
        : leave
    );
    setLeaveRequests(updatedLeaves);
    saveToStorage('leaveRequests', updatedLeaves);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const AddLeaveModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const newLeave = {
        id: `LV${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee?.personalDetails?.fullName,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: days,
        reason: formData.reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedDate: null
      };

      const updatedLeaves = [...leaveRequests, newLeave];
      setLeaveRequests(updatedLeaves);
      saveToStorage('leaveRequests', updatedLeaves);
      setShowAddModal(false);
      setFormData({
        employeeId: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Leave Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.personalDetails?.fullName}
                </option>
              ))}
            </select>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Leave Type</option>
              {LEAVE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            <textarea
              placeholder="Reason for leave"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Add Leave Request
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
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Request
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
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-gray-600 text-sm">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              <p className="text-gray-600 text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <X className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              <p className="text-gray-600 text-sm">Rejected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
              <p className="text-gray-600 text-sm">Total Requests</p>
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
                placeholder="Search leave requests..."
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
            {Object.values(LEAVE_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No leave requests found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {leave.employeeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Applied: {formatDate(leave.appliedDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.leaveType}</div>
                      <div className="text-sm text-gray-500">{leave.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">{leave.days} day(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {leave.status === 'Pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveLeave(leave.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectLeave(leave.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddLeaveModal />
    </div>
  );
};

export default LeaveManagement;