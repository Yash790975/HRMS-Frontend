import React, { useState } from 'react';
import { TrendingUp, Target, Award, Star, Calendar, User } from 'lucide-react';

const MyPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Mock performance data
  const performanceData = {
    overall: {
      rating: 4.2,
      previousRating: 3.8,
      goals: { completed: 8, total: 10 },
      skills: { improved: 5, total: 12 }
    },
    reviews: [
      {
        id: '1',
        period: 'Q4 2023',
        reviewer: 'Jane Smith',
        rating: 4.2,
        date: '2024-01-15',
        feedback: 'Excellent performance this quarter. Strong technical skills and great team collaboration.',
        strengths: ['Technical Excellence', 'Team Collaboration', 'Problem Solving'],
        improvements: ['Time Management', 'Documentation']
      },
      {
        id: '2',
        period: 'Q3 2023',
        reviewer: 'Jane Smith',
        rating: 3.8,
        date: '2023-10-15',
        feedback: 'Good progress on assigned projects. Need to focus more on meeting deadlines.',
        strengths: ['Code Quality', 'Innovation'],
        improvements: ['Deadline Management', 'Communication']
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Complete React Certification',
        description: 'Obtain React Developer Certification',
        status: 'completed',
        progress: 100,
        dueDate: '2024-03-31',
        category: 'skill-development'
      },
      {
        id: '2',
        title: 'Lead Team Project',
        description: 'Successfully lead the new dashboard project',
        status: 'in-progress',
        progress: 75,
        dueDate: '2024-04-30',
        category: 'leadership'
      },
      {
        id: '3',
        title: 'Improve Code Review Process',
        description: 'Implement better code review practices',
        status: 'in-progress',
        progress: 60,
        dueDate: '2024-05-15',
        category: 'process-improvement'
      }
    ]
  };

  const getGoalStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Performance</h1>
        <p className="text-gray-600">Track your performance, goals, and feedback</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Rating</p>
              <p className="text-2xl font-bold text-orange-600">{performanceData.overall.rating}/5</p>
              <p className="text-xs text-green-600">
                +{(performanceData.overall.rating - performanceData.overall.previousRating).toFixed(1)} from last review
              </p>
            </div>
            <Star className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Goals Achieved</p>
              <p className="text-2xl font-bold text-green-600">
                {performanceData.overall.goals.completed}/{performanceData.overall.goals.total}
              </p>
              <p className="text-xs text-gray-500">This year</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Skills Improved</p>
              <p className="text-2xl font-bold text-purple-600">
                {performanceData.overall.skills.improved}/{performanceData.overall.skills.total}
              </p>
              <p className="text-xs text-gray-500">This year</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="text-2xl font-bold text-orange-600">{performanceData.reviews.length}</p>
              <p className="text-xs text-gray-500">Total reviews</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Performance Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Performance Reviews</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="current">Current Year</option>
              <option value="previous">Previous Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {performanceData.reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.period} Review</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Reviewed by: {review.reviewer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-gray-900">{review.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                <p className="text-gray-700">{review.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <div className="space-y-1">
                    {review.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full mr-2 mb-1"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                  <div className="space-y-1">
                    {review.improvements.map((improvement, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full mr-2 mb-1"
                      >
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Performance Goals</h2>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
              Set New Goal
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {performanceData.goals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGoalStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                      {goal.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                  <button className="text-orange-600 hover:text-orange-800 font-medium">
                    Update Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPerformance;