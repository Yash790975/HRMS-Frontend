// // import React from 'react';
// // import { 
// //   Calendar, Clock, CheckSquare, TrendingUp, 
// //   Users, Bell, Award, Target 
// // } from 'lucide-react';
// // import { useAuth } from '../../contexts/AuthContext';
// // import { useUser } from '../../contexts/UserContext';
// // import { useLeave } from '../../contexts/LeaveContext';
// // import { useAttendance } from '../../contexts/AttendanceContext';
// // import { useTask } from '../../contexts/TaskContext';
// // import { useNotification } from '../../contexts/NotificationContext';
// // import DashboardCard from './DashboardCard';
// // import QuickActions from './QuickActions';
// // import RecentActivity from './RecentActivity';

// // const EmployeeDashboard = () => {
// //   const { user } = useAuth();
// //   const { userProfile } = useUser();
// //   const { leaveBalance } = useLeave();
// //   const { attendanceRecords, currentStatus } = useAttendance();
// //   const { tasks } = useTask();
// //   const { notifications } = useNotification();

// //   const unreadNotifications = notifications.filter(n => !n.read).length;
// //   const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
// //   const completedTasks = tasks.filter(t => t.status === 'completed').length;
// //   const totalLeaveBalance = Object.values(leaveBalance).reduce((total, leave) => total + leave.remaining, 0);

// //   const stats = [
// //     {
// //       title: 'Total Leave Balance',
// //       value: totalLeaveBalance,
// //       subtitle: 'Days remaining',
// //       icon: Calendar,
// //       color: 'blue',
// //       trend: '+2 from last month'
// //     },
// //     {
// //       title: 'Attendance Status',
// //       value: currentStatus === 'in' ? 'Checked In' : 'Checked Out',
// //       subtitle: currentStatus === 'in' ? 'Currently working' : 'Not at work',
// //       icon: Clock,
// //       color: currentStatus === 'in' ? 'green' : 'gray',
// //       trend: `${attendanceRecords.length} days this month`
// //     },
// //     {
// //       title: 'Active Tasks',
// //       value: pendingTasks,
// //       subtitle: `${completedTasks} completed`,
// //       icon: CheckSquare,
// //       color: 'purple',
// //       trend: pendingTasks > 0 ? 'Due soon' : 'All caught up!'
// //     },
// //     {
// //       title: 'Notifications',
// //       value: unreadNotifications,
// //       subtitle: 'Unread messages',
// //       icon: Bell,
// //       color: 'orange',
// //       trend: notifications.length > 0 ? 'View all' : 'No new messages'
// //     }
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       {/* Welcome Header */}
// //       <div className="bg-gradient-to-r from-orange-600 to-indigo-700 rounded-xl p-6 text-white">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold">
// //               Welcome back, {userProfile?.personalInfo?.firstName || user?.name}!
// //             </h1>
// //             <p className="text-orange-100 mt-1">
// //               {user?.position} • {user?.department}
// //             </p>
// //             <p className="text-orange-200 text-sm mt-2">
// //               Today is {new Date().toLocaleDateString('en-US', { 
// //                 weekday: 'long', 
// //                 year: 'numeric', 
// //                 month: 'long', 
// //                 day: 'numeric' 
// //               })}
// //             </p>
// //           </div>
// //           <div className="hidden md:block">
// //             <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
// //               {userProfile?.personalInfo?.profilePicture ? (
// //                 <img 
// //                   src={userProfile.personalInfo.profilePicture} 
// //                   alt="Profile" 
// //                   className="h-16 w-16 rounded-full object-cover"
// //                 />
// //               ) : (
// //                 <Award className="h-8 w-8 text-white" />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {stats.map((stat, index) => (
// //           <DashboardCard key={index} {...stat} />
// //         ))}
// //       </div>

// //       {/* Quick Actions and Recent Activity */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div className="lg:col-span-1">
// //           <QuickActions />
// //         </div>
// //         <div className="lg:col-span-2">
// //           <RecentActivity />
// //         </div>
// //       </div>

// //       {/* Performance Overview */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// //         <div className="flex items-center justify-between mb-6">
// //           <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
// //           <TrendingUp className="h-5 w-5 text-orange-600" />
// //         </div>
        
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="text-center">
// //             <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //               <Target className="h-8 w-8 text-green-600" />
// //             </div>
// //             <h3 className="font-semibold text-gray-900">Goals Achieved</h3>
// //             <p className="text-2xl font-bold text-green-600 mt-1">8/10</p>
// //             <p className="text-sm text-gray-500">This quarter</p>
// //           </div>
          
// //           <div className="text-center">
// //             <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //               <CheckSquare className="h-8 w-8 text-orange-600" />
// //             </div>
// //             <h3 className="font-semibold text-gray-900">Task Completion</h3>
// //             <p className="text-2xl font-bold text-orange-600 mt-1">92%</p>
// //             <p className="text-sm text-gray-500">This month</p>
// //           </div>
          
// //           <div className="text-center">
// //             <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //               <Users className="h-8 w-8 text-purple-600" />
// //             </div>
// //             <h3 className="font-semibold text-gray-900">Team Rating</h3>
// //             <p className="text-2xl font-bold text-purple-600 mt-1">4.8/5</p>
// //             <p className="text-sm text-gray-500">Peer feedback</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeDashboard;



// import React from 'react';
// import { 
//   Calendar, Clock, CheckSquare, TrendingUp, 
//   Users, Bell, Award, Target 
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useUser } from '../../contexts/UserContext';
// import { useLeave } from '../../contexts/LeaveContext';
// import { useAttendance } from '../../contexts/AttendanceContext';
// import { useTask } from '../../contexts/TaskContext';
// import { useNotification } from '../../contexts/NotificationContext';
// import DashboardCard from './DashboardCard';
// import QuickActions from './QuickActions';
// import RecentActivity from './RecentActivity';
// import AttendanceSection from './AttendanceSection';
// import TasksSection from './TasksSection';
// import ProjectsSection from './ProjectsSection';
// import TeamSection from './TeamSection';
// import PayrollSection from './PayrollSection';
// import BenefitsSection from './BenefitsSection';

// const EmployeeDashboard = () => {
//   const { user } = useAuth();
//   const { userProfile } = useUser();
//   const { leaveBalance } = useLeave();
//   const { attendanceRecords, currentStatus } = useAttendance();
//   const { tasks } = useTask();
//   const { notifications } = useNotification();

//   const unreadNotifications = notifications.filter(n => !n.read).length;
//   const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
//   const completedTasks = tasks.filter(t => t.status === 'completed').length;
//   const totalLeaveBalance = Object.values(leaveBalance).reduce((total, leave) => total + leave.remaining, 0);

//   const stats = [
//     {
//       title: 'Total Leave Balance',
//       value: totalLeaveBalance,
//       subtitle: 'Days remaining',
//       icon: Calendar,
//       color: 'blue',
//       trend: '+2 from last month'
//     },
//     {
//       title: 'Attendance Status',
//       value: currentStatus === 'in' ? 'Checked In' : 'Checked Out',
//       subtitle: currentStatus === 'in' ? 'Currently working' : 'Not at work',
//       icon: Clock,
//       color: currentStatus === 'in' ? 'green' : 'gray',
//       trend: `${attendanceRecords.length} days this month`
//     },
//     {
//       title: 'Active Tasks',
//       value: pendingTasks,
//       subtitle: `${completedTasks} completed`,
//       icon: CheckSquare,
//       color: 'purple',
//       trend: pendingTasks > 0 ? 'Due soon' : 'All caught up!'
//     },
//     {
//       title: 'Notifications',
//       value: unreadNotifications,
//       subtitle: 'Unread messages',
//       icon: Bell,
//       color: 'orange',
//       trend: notifications.length > 0 ? 'View all' : 'No new messages'
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-orange-600 to-indigo-700 rounded-xl p-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">
//               Welcome back, {userProfile?.personalInfo?.firstName || user?.name}!
//             </h1>
//             <p className="text-orange-100 mt-1">
//               {user?.position} • {user?.department}
//             </p>
//             <p className="text-orange-200 text-sm mt-2">
//               Today is {new Date().toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })}
//             </p>
//           </div>
//           <div className="hidden md:block">
//             <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               {userProfile?.personalInfo?.profilePicture ? (
//                 <img 
//                   src={userProfile.personalInfo.profilePicture} 
//                   alt="Profile" 
//                   className="h-16 w-16 rounded-full object-cover"
//                 />
//               ) : (
//                 <Award className="h-8 w-8 text-white" />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <DashboardCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Quick Actions and Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1">
//           <QuickActions />
//         </div>
//         <div className="lg:col-span-2">
//           <RecentActivity />
//         </div>
//       </div>

//       {/* Attendance and Tasks Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <AttendanceSection />
//         <TasksSection />
//       </div>

//       {/* Projects and Team Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ProjectsSection />
//         <TeamSection />
//       </div>

//       {/* Performance Overview */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
//           <TrendingUp className="h-5 w-5 text-orange-600" />
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center">
//             <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Target className="h-8 w-8 text-green-600" />
//             </div>
//             <h3 className="font-semibold text-gray-900">Goals Achieved</h3>
//             <p className="text-2xl font-bold text-green-600 mt-1">8/10</p>
//             <p className="text-sm text-gray-500">This quarter</p>
//           </div>
          
//           <div className="text-center">
//             <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <CheckSquare className="h-8 w-8 text-orange-600" />
//             </div>
//             <h3 className="font-semibold text-gray-900">Task Completion</h3>
//             <p className="text-2xl font-bold text-orange-600 mt-1">92%</p>
//             <p className="text-sm text-gray-500">This month</p>
//           </div>
          
//           <div className="text-center">
//             <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Users className="h-8 w-8 text-purple-600" />
//             </div>
//             <h3 className="font-semibold text-gray-900">Team Rating</h3>
//             <p className="text-2xl font-bold text-purple-600 mt-1">4.8/5</p>
//             <p className="text-sm text-gray-500">Peer feedback</p>
//           </div>
//         </div>
//       </div>

//       {/* Payroll and Benefits Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <PayrollSection />
//         <BenefitsSection />
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;

import React from 'react';
import { 
  Calendar, Clock, CheckSquare, TrendingUp, 
  Users, Bell, Award, Target 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useLeave } from '../../contexts/LeaveContext';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useTask } from '../../contexts/TaskContext';
import { useNotification } from '../../contexts/NotificationContext';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import AttendanceSection from './AttendanceSection';
import TasksSection from './TasksSection';
import ProjectsSection from './ProjectsSection';
import TeamSection from './TeamSection';
import PayrollSection from './PayrollSection';
import BenefitsSection from './BenefitsSection';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { userProfile } = useUser();
  const { leaveBalance } = useLeave();
  const { attendanceRecords, currentStatus } = useAttendance();
  const { tasks } = useTask();
  const { notifications } = useNotification();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalLeaveBalance = Object.values(leaveBalance).reduce((total, leave) => total + leave.remaining, 0);

  const stats = [
    {
      title: 'Total Leave Balance',
      value: totalLeaveBalance,
      subtitle: 'Days remaining',
      icon: Calendar,
      color: 'blue',
      trend: '+2 from last month'
    },
    {
      title: 'Attendance Status',
      value: currentStatus === 'in' ? 'Checked In' : 'Checked Out',
      subtitle: currentStatus === 'in' ? 'Currently working' : 'Not at work',
      icon: Clock,
      color: currentStatus === 'in' ? 'green' : 'gray',
      trend: `${attendanceRecords.length} days this month`
    },
    {
      title: 'Active Tasks',
      value: pendingTasks,
      subtitle: `${completedTasks} completed`,
      icon: CheckSquare,
      color: 'purple',
      trend: pendingTasks > 0 ? 'Due soon' : 'All caught up!'
    },
    {
      title: 'Notifications',
      value: unreadNotifications,
      subtitle: 'Unread messages',
      icon: Bell,
      color: 'orange',
      trend: notifications.length > 0 ? 'View all' : 'No new messages'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {userProfile?.personalInfo?.firstName || user?.name}!
            </h1>
            <p className="text-orange-100 mt-1">
              {user?.position} • {user?.department}
            </p>
            <p className="text-orange-200 text-sm mt-2">
              Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              {userProfile?.personalInfo?.profilePicture ? (
                <img 
                  src={userProfile.personalInfo.profilePicture} 
                  alt="Profile" 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <Award className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Attendance and Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceSection />
        <TasksSection />
      </div>

      {/* Projects and Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsSection />
        <TeamSection />
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <TrendingUp className="h-5 w-5 text-orange-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Goals Achieved</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">8/10</p>
            <p className="text-sm text-gray-500">This quarter</p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Task Completion</h3>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Team Rating</h3>
            <p className="text-2xl font-bold text-purple-600 mt-1">4.8/5</p>
            <p className="text-sm text-gray-500">Peer feedback</p>
          </div>
        </div>
      </div>

      {/* Payroll and Benefits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollSection />
        <BenefitsSection />
      </div>
    </div>
  );
};

export default EmployeeDashboard;