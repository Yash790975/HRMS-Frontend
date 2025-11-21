import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TaskAllocation = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    project: '',
    status: 'pending'
  });

  useEffect(() => {
    // Load tasks and team members from localStorage
    const loadData = () => {
      const savedTasks = JSON.parse(localStorage.getItem('hrms_tasks') || '[]');
      const savedMembers = JSON.parse(localStorage.getItem('hrms_team_members') || '[]');
      
      if (savedTasks.length === 0) {
        // Add sample tasks
        const sampleTasks = [
          {
            id: 1,
            title: 'Implement User Authentication',
            description: 'Add login and registration functionality',
            assignedTo: 'EMP001',
            assignedToName: 'John Doe',
            priority: 'high',
            dueDate: '2024-02-15',
            project: 'Project Alpha',
            status: 'in-progress',
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            title: 'Design Dashboard UI',
            description: 'Create mockups for the main dashboard',
            assignedTo: 'EMP003',
            assignedToName: 'Mike Johnson',
            priority: 'medium',
            dueDate: '2024-02-20',
            project: 'Project Beta',
            status: 'pending',
            createdAt: '2024-01-16'
          }
        ];
        localStorage.setItem('hrms_tasks', JSON.stringify(sampleTasks));
        setTasks(sampleTasks);
      } else {
        setTasks(savedTasks);
      }

      if (savedMembers.length === 0) {
        // Add sample team members
        const sampleMembers = [
          { id: 1, name: 'John Doe', employeeId: 'EMP001', designation: 'Senior Developer' },
          { id: 2, name: 'Sarah Smith', employeeId: 'EMP002', designation: 'Product Manager' },
          { id: 3, name: 'Mike Johnson', employeeId: 'EMP003', designation: 'UX Designer' }
        ];
        localStorage.setItem('hrms_team_members', JSON.stringify(sampleMembers));
        setTeamMembers(sampleMembers);
      } else {
        setTeamMembers(savedMembers);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const assignedMember = teamMembers.find(member => member.employeeId === formData.assignedTo);
    
    if (selectedTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id
          ? {
              ...task,
              ...formData,
              assignedToName: assignedMember?.name || ''
            }
          : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('hrms_tasks', JSON.stringify(updatedTasks));
    } else {
      // Create new task
      const newTask = {
        id: Date.now(),
        ...formData,
        assignedToName: assignedMember?.name || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('hrms_tasks', JSON.stringify(updatedTasks));
    }

    setShowModal(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      project: '',
      status: 'pending'
    });
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project,
      status: task.status
    });
    setShowModal(true);
  };

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('hrms_tasks', JSON.stringify(updatedTasks));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('hrms_tasks', JSON.stringify(updatedTasks));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const TaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Select team member</option>
              {teamMembers.map(member => (
                <option key={member.employeeId} value={member.employeeId}>
                  {member.name} ({member.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <input
              type="text"
              value={formData.project}
              onChange={(e) => setFormData({...formData, project: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Project name"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {selectedTask ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedTask(null);
                setFormData({
                  title: '',
                  description: '',
                  assignedTo: '',
                  priority: 'medium',
                  dueDate: '',
                  project: '',
                  status: 'pending'
                });
              }}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white flex-1 mr-4">
          <h1 className="text-2xl font-bold mb-2">Task Allocation</h1>
          <p className="text-orange-100">Assign and track tasks for your team members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{task.assignedToName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Due: {task.dueDate}</span>
              </div>
              {task.project && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{task.project}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showModal && <TaskModal />}
    </div>
  );
};

export default TaskAllocation;