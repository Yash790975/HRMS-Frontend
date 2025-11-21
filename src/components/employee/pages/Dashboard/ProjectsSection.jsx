// import React from 'react';
// import { Folder, Users, Calendar, TrendingUp, MoreHorizontal } from 'lucide-react';

// const ProjectsSection = () => {
//   const projects = [
//     {
//       id: 1,
//       name: 'HRMS Portal Development',
//       description: 'Complete employee management system with advanced features',
//       progress: 75,
//       status: 'In Progress',
//       dueDate: '2025-07-15',
//       teamSize: 6,
//       priority: 'High',
//       color: 'orange'
//     },
//     {
//       id: 2,
//       name: 'Mobile App Integration',
//       description: 'Integrate mobile app with existing backend services',
//       progress: 45,
//       status: 'In Progress',
//       dueDate: '2025-08-20',
//       teamSize: 4,
//       priority: 'Medium',
//       color: 'blue'
//     },
//     {
//       id: 3,
//       name: 'Database Migration',
//       description: 'Migrate legacy database to new cloud infrastructure',
//       progress: 100,
//       status: 'Completed',
//       dueDate: '2025-06-10',
//       teamSize: 3,
//       priority: 'High',
//       color: 'green'
//     },
//     {
//       id: 4,
//       name: 'API Documentation',
//       description: 'Create comprehensive API documentation for developers',
//       progress: 25,
//       status: 'Planning',
//       dueDate: '2025-09-30',
//       teamSize: 2,
//       priority: 'Low',
//       color: 'purple'
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed': return 'bg-green-100 text-green-800';
//       case 'In Progress': return 'bg-blue-100 text-blue-800';
//       case 'Planning': return 'bg-yellow-100 text-yellow-800';
//       case 'On Hold': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'High': return 'bg-red-100 text-red-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress >= 80) return 'bg-green-500';
//     if (progress >= 50) return 'bg-blue-500';
//     if (progress >= 25) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
//         <TrendingUp className="h-5 w-5 text-orange-600" />
//       </div>

//       {/* Project Stats */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="text-center p-3 bg-blue-50 rounded-lg">
//           <p className="text-2xl font-bold text-blue-600">{projects.filter(p => p.status === 'In Progress').length}</p>
//           <p className="text-sm text-blue-600">Active</p>
//         </div>
//         <div className="text-center p-3 bg-green-50 rounded-lg">
//           <p className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'Completed').length}</p>
//           <p className="text-sm text-green-600">Completed</p>
//         </div>
//         <div className="text-center p-3 bg-yellow-50 rounded-lg">
//           <p className="text-2xl font-bold text-yellow-600">{projects.filter(p => p.status === 'Planning').length}</p>
//           <p className="text-sm text-yellow-600">Planning</p>
//         </div>
//       </div>

//       {/* Projects List */}
//       <div className="space-y-4">
//         {projects.map((project) => (
//           <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-start space-x-3">
//                 <div className={`w-3 h-3 rounded-full bg-${project.color}-500 mt-2`}></div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">{project.name}</h3>
//                   <p className="text-sm text-gray-600 mt-1">{project.description}</p>
//                 </div>
//               </div>
//               <button className="p-1 text-gray-400 hover:text-gray-600">
//                 <MoreHorizontal className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-3">
//               <div className="flex items-center justify-between text-sm mb-1">
//                 <span className="text-gray-600">Progress</span>
//                 <span className="font-medium text-gray-900">{project.progress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
//                   style={{ width: `${project.progress}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Project Details */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4 text-sm text-gray-600">
//                 <div className="flex items-center space-x-1">
//                   <Users className="h-4 w-4" />
//                   <span>{project.teamSize} members</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Calendar className="h-4 w-4" />
//                   <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
//                   {project.priority}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                   {project.status}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* View All Projects Link */}
//       <div className="mt-4 text-center">
//         <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
//           View All Projects →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectsSection;     
import React from 'react';
import { Folder, Users, Calendar, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';

const ProjectsSection = () => {
  const { projects } = useTask();
  const navigate = useNavigate();

  // Get recent projects (limit to 3 for dashboard)
  const recentProjects = projects.slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
        <TrendingUp className="h-5 w-5 text-orange-600" />
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{projects.filter(p => p.status === 'active').length}</p>
          <p className="text-sm text-blue-600">Active</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'completed').length}</p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{projects.filter(p => p.status === 'planning').length}</p>
          <p className="text-sm text-yellow-600">Planning</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full bg-orange-500 mt-2`}></div>
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{project.teamMembers.length} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Projects Link */}
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/projects')}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          View All Projects →
        </button>
      </div>

      {recentProjects.length === 0 && (
        <div className="text-center py-8">
          <Folder className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No projects assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;