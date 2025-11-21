// import React from 'react';
// import { CheckSquare, Clock, AlertCircle, Plus, Filter } from 'lucide-react';

// const TasksSection = () => {
//   const tasks = [
//     {
//       id: 1,
//       title: 'Complete API Documentation',
//       priority: 'High',
//       status: 'in-progress',
//       dueDate: '2025-06-18',
//       project: 'HRMS Portal',
//       assignedBy: 'John Smith'
//     },
//     {
//       id: 2,
//       title: 'Code Review - Authentication Module',
//       priority: 'Medium',
//       status: 'todo',
//       dueDate: '2025-06-19',
//       project: 'Employee Portal',
//       assignedBy: 'Sarah Johnson'
//     },
//     {
//       id: 3,
//       title: 'Bug Fix - Dashboard Loading Issue',
//       priority: 'High',
//       status: 'todo',
//       dueDate: '2025-06-17',
//       project: 'HRMS Portal',
//       assignedBy: 'Mike Wilson'
//     },
//     {
//       id: 4,
//       title: 'Database Optimization',
//       priority: 'Low',
//       status: 'completed',
//       dueDate: '2025-06-15',
//       project: 'Backend Services',
//       assignedBy: 'Emily Davis'
//     }
//   ];

//   const taskStats = {
//     total: tasks.length,
//     completed: tasks.filter(t => t.status === 'completed').length,
//     inProgress: tasks.filter(t => t.status === 'in-progress').length,
//     todo: tasks.filter(t => t.status === 'todo').length
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'High': return 'bg-red-100 text-red-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'in-progress': return 'bg-blue-100 text-blue-800';
//       case 'todo': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const isOverdue = (dueDate) => {
//     return new Date(dueDate) < new Date() && dueDate !== new Date().toISOString().split('T')[0];
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
//         <div className="flex items-center space-x-2">
//           <button className="flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
//             <Plus className="h-4 w-4 mr-1" />
//             New Task
//           </button>
//           <button className="p-1 text-gray-400 hover:text-gray-600">
//             <Filter className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Task Statistics */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <div className="text-center p-3 bg-gray-50 rounded-lg">
//           <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
//           <p className="text-sm text-gray-600">Total</p>
//         </div>
//         <div className="text-center p-3 bg-blue-50 rounded-lg">
//           <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
//           <p className="text-sm text-blue-600">In Progress</p>
//         </div>
//         <div className="text-center p-3 bg-yellow-50 rounded-lg">
//           <p className="text-2xl font-bold text-yellow-600">{taskStats.todo}</p>
//           <p className="text-sm text-yellow-600">To Do</p>
//         </div>
//         <div className="text-center p-3 bg-green-50 rounded-lg">
//           <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
//           <p className="text-sm text-green-600">Completed</p>
//         </div>
//       </div>

//       {/* Task List */}
//       <div className="space-y-3">
//         {tasks.map((task) => (
//           <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <h3 className="font-medical text-gray-900">{task.title}</h3>
//                   {isOverdue(task.dueDate) && task.status !== 'completed' && (
//                     <AlertCircle className="h-4 w-4 text-red-500" />
//                   )}
//                 </div>
                
//                 <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
//                   <span>Project: {task.project}</span>
//                   <span>•</span>
//                   <span>Assigned by: {task.assignedBy}</span>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
//                     {task.priority}
//                   </span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
//                     {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-2 ml-4">
//                 <div className="text-right text-sm">
//                   <p className="text-gray-600">Due</p>
//                   <p className={`font-medium ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-900'}`}>
//                     {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   </p>
//                 </div>
//                 {task.status !== 'completed' && (
//                   <button className="p-1 text-gray-400 hover:text-green-600">
//                     <CheckSquare className="h-5 w-5" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>    

//       {/* View All Tasks Link */}
//       <div className="mt-4 text-center">
//         <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
//           View All Tasks →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TasksSection;

import React from 'react';
import { CheckSquare, Clock, AlertCircle, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';

const TasksSection = () => {
  const { tasks, updateTaskStatus } = useTask();
  const navigate = useNavigate();

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length
  };

  // Get recent tasks (limit to 3 for dashboard)
  const recentTasks = tasks.slice(0, 3);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== new Date().toISOString().split('T')[0];
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          <p className="text-sm text-blue-600">In Progress</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{taskStats.todo}</p>
          <p className="text-sm text-yellow-600">To Do</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {recentTasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {isOverdue(task.dueDate) && task.status !== 'completed' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span>Project: {task.project}</span>
                  <span>•</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => handleStatusChange(task.id, 'completed')}
                    className="p-1 text-gray-400 hover:text-green-600"
                  >
                    <CheckSquare className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>    

      {/* View All Tasks Link */}
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/tasks')}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          View All Tasks →
        </button>
      </div>

      {recentTasks.length === 0 && (
        <div className="text-center py-8">
          <CheckSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No tasks assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;