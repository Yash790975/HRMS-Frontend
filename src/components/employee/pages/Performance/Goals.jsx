import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, Filter } from 'lucide-react';

const Goals = () => {
  const [filter, setFilter] = useState('all');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'skill-development',
    dueDate: '',
    priority: 'medium'
  });

  // Mock goals data
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Complete React Certification',
      description: 'Obtain React Developer Certification from official React training program',
      status: 'completed',
      progress: 100,
      dueDate: '2024-03-31',
      category: 'skill-development',
      priority: 'high',
      createdDate: '2024-01-01'
    },
    {
      id: '2',
      title: 'Lead Team Project',
      description: 'Successfully lead the new dashboard project and mentor junior developers',
      status: 'in-progress',
      progress: 75,
      dueDate: '2024-04-30',
      category: 'leadership',
      priority: 'high',
      createdDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Improve Code Review Process',
      description: 'Implement better code review practices and documentation standards',
      status: 'in-progress',
      progress: 60,
      dueDate: '2024-05-15',
      category: 'process-improvement',
      priority: 'medium',
      createdDate: '2024-02-01'
    },
    {
      id: '4',
      title: 'Learn TypeScript',
      description: 'Master TypeScript for better code quality and type safety',
      status: 'not-started',
      progress: 0,
      dueDate: '2024-06-30',
      category: 'skill-development',
      priority: 'medium',
      createdDate: '2024-02-15'
    }
  ]);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'skill-development':
        return 'bg-purple-100 text-purple-800';
      case 'leadership':
        return 'bg-orange-100 text-orange-800';
      case 'process-improvement':
        return 'bg-green-100 text-green-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.description && newGoal.dueDate) {
      const goal = {
        ...newGoal,
        id: Date.now().toString(),
        status: 'not-started',
        progress: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setGoals([goal, ...goals]);
      setNewGoal({
        title: '',
        description: '',
        category: 'skill-development',
        dueDate: '',
        priority: 'medium'
      });
      setShowAddGoal(false);
    }
  };

  const updateGoalProgress = (goalId, progress) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newStatus = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
        return { ...goal, progress: parseInt(progress), status: newStatus };
      }
      return goal;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Goals</h1>
          <p className="text-gray-600">Set and track your professional development goals</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.status === 'completed').length}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">
                {goals.filter(g => g.status === 'in-progress').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe your goal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="skill-development">Skill Development</option>
                    <option value="leadership">Leadership</option>
                    <option value="process-improvement">Process Improvement</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('-', ' ')}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                  {goal.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Created: {new Date(goal.createdDate).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'You haven\'t set any goals yet. Start by adding your first goal!' 
              : `No ${filter.replace('-', ' ')} goals found.`}
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Add Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;