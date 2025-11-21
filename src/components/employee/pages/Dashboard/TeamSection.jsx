import React from 'react';
import { Users, MessageCircle, UserPlus, Mail, Phone, MapPin } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Team Lead',
      department: 'Engineering',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Mike Wilson',
      role: 'Senior Developer',
      department: 'Engineering',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      email: 'mike.wilson@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UI/UX Designer',
      department: 'Design',
      avatar: '/api/placeholder/40/40',
      status: 'away',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA'
    },
    {
      id: 4,
      name: 'John Smith',
      role: 'Project Manager',
      department: 'Management',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
      email: 'john.smith@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL'
    },
    {
      id: 5,
      name: 'Lisa Chen',
      role: 'QA Engineer',
      department: 'Quality Assurance',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      email: 'lisa.chen@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Seattle, WA'
    }
  ];

  const teamStats = {
    totalMembers: teamMembers.length,
    onlineMembers: teamMembers.filter(m => m.status === 'online').length,
    departments: [...new Set(teamMembers.map(m => m.department))].length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">My Team</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </button>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{teamStats.totalMembers}</p>
          <p className="text-sm text-blue-600">Total Members</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{teamStats.onlineMembers}</p>
          <p className="text-sm text-green-600">Online Now</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{teamStats.departments}</p>
          <p className="text-sm text-purple-600">Departments</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.department}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'online' ? 'bg-green-100 text-green-800' :
                  member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(member.status)}
                </span>
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Member Details (Collapsed by default, can be expanded) */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Team Link */}
      <div className="mt-4 text-center">
        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          View Complete Team Directory →
        </button>
      </div>
    </div>
  );
};

export default TeamSection;    