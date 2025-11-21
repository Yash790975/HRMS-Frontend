import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Search, Filter } from 'lucide-react';

const MyTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock team data
  const teamMembers = [
    {
      id: '1',
      name: 'Jane Smith',
      position: 'Engineering Manager',
      department: 'Engineering',
      email: 'jane.smith@company.com',
      phone: '+1-555-0101',
      location: 'San Francisco Office',
      avatar: null,
      status: 'online',
      skills: ['Leadership', 'Project Management', 'React', 'Node.js'],
      joinDate: '2022-01-15'
    },
    {
      id: '2',
      name: 'Bob Wilson',
      position: 'Senior Developer',
      department: 'Engineering',
      email: 'bob.wilson@company.com',
      phone: '+1-555-0102',
      location: 'San Francisco Office',
      avatar: null,
      status: 'online',
      skills: ['React', 'TypeScript', 'GraphQL', 'AWS'],
      joinDate: '2021-03-20'
    },
    {
      id: '3',
      name: 'Alice Johnson',
      position: 'UX Designer',
      department: 'Design',
      email: 'alice.johnson@company.com',
      phone: '+1-555-0103',
      location: 'Remote',
      avatar: null,
      status: 'away',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
      joinDate: '2022-06-10'
    },
    {
      id: '4',
      name: 'Mike Chen',
      position: 'DevOps Engineer',
      department: 'Engineering',
      email: 'mike.chen@company.com',
      phone: '+1-555-0104',
      location: 'New York Office',
      avatar: null,
      status: 'offline',
      skills: ['Docker',  'Kubernetes', 'AWS', 'CI/CD'],
      joinDate: '2021-11-05'
    },
    {
      id: '5',
      name: 'Sarah Davis',
      position: 'Product Manager',
      department: 'Product',
      email: 'sarah.davis@company.com',
      phone: '+1-555-0105',
      location: 'San Francisco Office',
      avatar: null,
      status: 'online',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'User Stories'],
      joinDate: '2022-02-28'
    },
    {
      id: '6',
      name: 'Tom Rodriguez',
      position: 'QA Engineer',
      department: 'Engineering',
      email: 'tom.rodriguez@company.com',
      phone: '+1-555-0106',
      location: 'Remote',
      avatar: null,
      status: 'online',
      skills: ['Test Automation', 'Selenium', 'Jest', 'Quality Assurance'],
      joinDate: '2021-09-12'
    }
  ];

  const departments = ['all', ...new Set(teamMembers.map(member => member.department))];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
        <p className="text-gray-600">Connect with your team members and colleagues</p>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-green-600">
                {teamMembers.filter(m => m.status === 'online').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-purple-600">{departments.length - 1}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remote Workers</p>
              <p className="text-2xl font-bold text-orange-600">
                {teamMembers.filter(m => m.location === 'Remote').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                <p className="text-sm text-gray-600 truncate">{member.position}</p>
                <p className="text-xs text-gray-500">{member.department}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="truncate">{member.location}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{member.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center space-x-3">
              <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 text-sm font-medium">
                Message
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 text-sm font-medium">
                View Profile
              </button>
            </div>

            {/* Join Date */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Joined: {new Date(member.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500">
            {searchTerm || departmentFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No team members available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTeam;