import React from 'react';
import { 
  Calendar, CheckSquare, Clock, Receipt, 
  FileText, Award, Users, Bell 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  // Mock recent activities - in real app, this would come from context/API
  const activities = [
    {
      id: '1',
      type: 'leave',
      title: 'Leave request approved',
      description: 'Your vacation request for Jan 15-17 has been approved',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: Calendar,
      color: 'green'
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      description: 'Completed "Implement user authentication" task',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: CheckSquare,
      color: 'blue'
    },
    {
      id: '3',
      type: 'attendance',
      title: 'Checked in',
      description: 'Started your workday at 9:00 AM',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: Clock,
      color: 'purple'
    },
    {
      id: '4',
      type: 'expense',
      title: 'Expense submitted',
      description: 'Travel expense claim for $150 submitted',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: Receipt,
      color: 'orange'
    },
    {
      id: '5',
      type: 'performance',
      title: 'Goal achieved',
      description: 'Completed Q1 project delivery goal',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: Award,
      color: 'yellow'
    },
    {
      id: '6',
      type: 'team',
      title: 'Team meeting',
      description: 'Attended weekly team standup meeting',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: Users,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <Bell className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getColorClasses(activity.color)}`}>
                      <activity.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;