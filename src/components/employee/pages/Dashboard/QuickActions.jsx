import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Receipt, FileText, 
  CheckSquare, Users, Video, Settings 
} from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { currentStatus, checkIn, checkOut } = useAttendance();

  const handleAttendanceToggle = () => {
    if (currentStatus === 'out') {
      checkIn();
    } else {
      checkOut();
    }
  };

  const actions = [
    {
      title: currentStatus === 'out' ? 'Check In' : 'Check Out',
      description: currentStatus === 'out' ? 'Start your workday' : 'End your workday',
      icon: Clock,
      color: currentStatus === 'out' ? 'green' : 'red',
      action: handleAttendanceToggle
    },
    {
      title: 'Apply Leave',
      description: 'Request time off',
      icon: Calendar,
      color: 'blue',
      action: () => navigate('/leave/apply')
    },
    {
      title: 'Submit Expense',
      description: 'Add expense claim',
      icon: Receipt,
      color: 'purple',
      action: () => navigate('/expenses/submit')
    },
    {
      title: 'View Tasks',
      description: 'Check your tasks',
      icon: CheckSquare,
      color: 'orange',
      action: () => navigate('/tasks')
    },
    {
      title: 'Team Directory',
      description: 'Contact colleagues',
      icon: Users,
      color: 'indigo',
      action: () => navigate('/team')
    },
    {
      title: 'My Documents',
      description: 'Access files',
      icon: FileText,
      color: 'gray',
      action: () => navigate('/documents')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-left group"
          >
            <div className={`h-10 w-10 rounded-lg bg-${action.color}-100 flex items-center justify-center mr-3 group-hover:bg-${action.color}-200 transition-colors`}>
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;