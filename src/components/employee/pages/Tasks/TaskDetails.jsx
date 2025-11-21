import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Flag, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTaskStatus, updateTaskProgress } = useTask();
  const [newComment, setNewComment] = useState('');
  
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task not found</h3>
        <button
          onClick={() => navigate('/tasks')}
          className="text-orange-600 hover:text-orange-800"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleProgressChange = (progress) => {
    updateTaskProgress(task.id, parseInt(progress));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would add to task comments
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tasks')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600">Task Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{task.title}</h2>
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Assigned by: {task.assignedBy}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-gray-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress}
                onChange={(e) => handleProgressChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments & Updates</h3>
            
            {/* Add Comment */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or update..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="flex items-center justify-between mt-2">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm">Attach file</span>
                </button>
                <button
                  onClick={handleAddComment}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm"
                >
                  Add Comment
                </button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">You</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Started working on the authentication module. Making good progress.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{task.assignedBy}</span>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Task assigned. Please focus on security best practices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Project Name</span>
                <p className="font-medium text-gray-900">{task.project}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Priority</span>
                <p className={`font-medium capitalize ${getPriorityColor(task.priority).split(' ')[0]}`}>
                  {task.priority}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <p className="font-medium text-gray-900 capitalize">{task.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="font-medium text-gray-900">12h 30m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated</span>
                <span className="font-medium text-gray-900">20h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining</span>
                <span className="font-medium text-gray-900">7h 30m</span>
              </div>
              <button className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Start Timer</span>
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">requirements.pdf</span>
              </div>
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">mockups.png</span>
              </div>
              <button className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <Paperclip className="h-4 w-4" />
                <span>Add Attachment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;