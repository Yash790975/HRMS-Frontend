import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Search, Filter } from 'lucide-react';

const TeamDetails = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Load team members from localStorage
    const loadTeamMembers = () => {
      const members = JSON.parse(localStorage.getItem('hrms_team_members') || '[]');
      if (members.length === 0) {
        // Add sample data
        const sampleMembers = [
          {
            id: 1,
            name: 'John Doe',
            employeeId: 'EMP001',
            email: 'john.doe@company.com',
            phone: '+1 (555) 123-4567',
            designation: 'Senior Software Engineer',
            department: 'Engineering',
            joinDate: '2022-01-15',
            location: 'New York, NY',
            skills: ['React', 'Node.js', 'Python', 'AWS'],
            performance: 4.5,
            projects: ['Project Alpha', 'Project Beta'],
            reportingManager: 'Manager Name'
          },
          {
            id: 2,
            name: 'Sarah Smith',
            employeeId: 'EMP002',
            email: 'sarah.smith@company.com',
            phone: '+1 (555) 987-6543',
            designation: 'Product Manager',
            department: 'Product',
            joinDate: '2021-08-20',
            location: 'San Francisco, CA',
            skills: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
            performance: 4.8,
            projects: ['Project Gamma', 'Project Delta'],
            reportingManager: 'Manager Name'
          },
          {
            id: 3,
            name: 'Mike Johnson',
            employeeId: 'EMP003',
            email: 'mike.johnson@company.com',
            phone: '+1 (555) 456-7890',
            designation: 'UX Designer',
            department: 'Design',
            joinDate: '2023-03-10',
            location: 'Austin, TX',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
            performance: 4.2,
            projects: ['Project Alpha', 'Project Epsilon'],
            reportingManager: 'Manager Name'
          }
        ];
        localStorage.setItem('hrms_team_members', JSON.stringify(sampleMembers));
        setTeamMembers(sampleMembers);
      } else {
        setTeamMembers(members);
      }
    };

    loadTeamMembers();
  }, []);

  useEffect(() => {
    // Filter members based on search term
    if (searchTerm) {
      const filtered = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(teamMembers);
    }
  }, [teamMembers, searchTerm]);

  const MemberDetailModal = ({ member, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Employee Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                  <p className="text-gray-600">{member.employeeId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Designation:</span>
                  <span className="text-sm font-medium text-gray-900">{member.designation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Join Date:</span>
                  <span className="text-sm font-medium text-gray-900">{member.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-900">{member.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Current Projects</h5>
                <div className="space-y-1">
                  {member.projects.map((project, index) => (
                    <span key={index} className="block text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                      {project}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">Performance Rating</h5>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(member.performance) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{member.performance}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Team Details</h1>
        <p className="text-orange-100">View and manage your team member information</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredMembers.length} members</span>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.employeeId}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{member.designation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{member.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{member.location}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Performance:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(member.performance) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{member.performance}/5</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {member.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{member.skills.length - 3} more
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedMember(member)}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default TeamDetails;