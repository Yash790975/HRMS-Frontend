import React, { useState, useEffect } from 'react';
import { TrendingUp, User, Star, Award, Target, Calendar } from 'lucide-react';

const PerformanceManagement = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Load performance data from localStorage
    const loadPerformanceData = () => {
      const data = JSON.parse(localStorage.getItem('hrms_performance') || '[]');
      if (data.length === 0) {
        // Add sample data
        const sampleData = [
          {
            id: 1,
            employeeName: 'John Doe',
            employeeId: 'EMP001',
            designation: 'Senior Software Engineer',
            currentRating: 4.5,
            goals: [
              { title: 'Complete Project Alpha', status: 'completed', progress: 100 },
              { title: 'Learn AWS Certification', status: 'in-progress', progress: 75 },
              { title: 'Mentor Junior Developers', status: 'pending', progress: 30 }
            ],
            lastReview: '2024-01-15',
            nextReview: '2024-04-15',
            strengths: ['Technical Skills', 'Problem Solving', 'Leadership'],
            improvements: ['Communication', 'Time Management'],
            achievements: ['Completed 5 projects', 'Led team successfully']
          },
          {
            id: 2,
            employeeName: 'Sarah Smith',
            employeeId: 'EMP002',
            designation: 'Product Manager',
            currentRating: 4.8,
            goals: [
              { title: 'Launch Product Beta', status: 'completed', progress: 100 },
              { title: 'Increase User Engagement', status: 'in-progress', progress: 60 },
              { title: 'Market Research Analysis', status: 'completed', progress: 100 }
            ],
            lastReview: '2024-01-10',
            nextReview: '2024-04-10',
            strengths: ['Strategic Thinking', 'User Focus', 'Data Analysis'],
            improvements: ['Technical Knowledge'],
            achievements: ['Launched 2 successful products', 'Increased user base by 40%']
          }
        ];
        localStorage.setItem('hrms_performance', JSON.stringify(sampleData));
        setPerformanceData(sampleData);
      } else {
        setPerformanceData(data);
      }
    };

    loadPerformanceData();
  }, []);

  const updateRating = (employeeId, newRating) => {
    const updatedData = performanceData.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, currentRating: newRating };
      }
      return emp;
    });
    setPerformanceData(updatedData);
    localStorage.setItem('hrms_performance', JSON.stringify(updatedData));
  };

  const getGoalStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const PerformanceDetailModal = ({ employee, onClose, onRatingUpdate }) => {
    const [rating, setRating] = useState(employee.currentRating);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
      onRatingUpdate(employee.id, rating);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Performance Review - {employee.employeeName}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{employee.employeeName}</h4>
                  <p className="text-gray-600">{employee.designation}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Last Review:</span>
                  <span className="text-sm font-medium text-gray-900">{employee.lastReview}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Next Review:</span>
                  <span className="text-sm font-medium text-gray-900">{employee.nextReview}</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Current Rating</h5>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className={`text-2xl ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-900">{rating}/5</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Strengths</h5>
                <div className="flex flex-wrap gap-2">
                  {employee.strengths.map((strength, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Areas for Improvement</h5>
                <div className="flex flex-wrap gap-2">
                  {employee.improvements.map((improvement, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {improvement}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Key Achievements</h5>
                <div className="space-y-1">
                  {employee.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Goals and Feedback */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Goals Progress</h5>
                <div className="space-y-3">
                  {employee.goals.map((goal, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">{goal.title}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getGoalStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{goal.progress}% Complete</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="6"
                  placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save Review
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Performance Management</h1>
        <p className="text-orange-100">Review and manage your team's performance and goals</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceData.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{employee.employeeName}</h3>
                <p className="text-sm text-gray-600">{employee.designation}</p>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current Rating</span>
                  <span className="text-sm font-medium text-gray-900">{employee.currentRating}/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(employee.currentRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Goals Progress</span>
                <div className="mt-1 space-y-1">
                  {employee.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 min-w-fit">{goal.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Review:</span>
                  <span className="text-gray-900">{employee.lastReview}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Review:</span>
                  <span className="text-gray-900">{employee.nextReview}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedEmployee(employee)}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Review Performance</span>
            </button>
          </div>
        ))}
      </div>

      {/* Performance Detail Modal */}
      {selectedEmployee && (
        <PerformanceDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onRatingUpdate={updateRating}
        />
      )}
    </div>
  );
};

export default PerformanceManagement;