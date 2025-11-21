import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Plus, Filter } from 'lucide-react';

const MyMeetings = () => {
  const [filter, setFilter] = useState('upcoming');
  const [showAddMeeting, setShowAddMeeting] = useState(false);

  // Mock meetings data
  const meetings = [
    {
      id: '1',
      title: 'Weekly Team Standup',
      description: 'Weekly sync with the development team',
      date: '2024-01-20',
      time: '09:00',
      duration: 30,
      type: 'recurring',
      status: 'upcoming',
      organizer: 'Jane Smith',
      attendees: ['John Doe', 'Bob Wilson', 'Alice Johnson'],
      location: 'Conference Room A',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      agenda: ['Sprint progress review', 'Blockers discussion', 'Next week planning']
    },
    {
      id: '2',
      title: 'Project Kickoff Meeting',
      description: 'Kickoff meeting for the new dashboard project',
      date: '2024-01-22',
      time: '14:00',
      duration: 60,
      type: 'one-time',
      status: 'upcoming',
      organizer: 'Sarah Davis',
      attendees: ['John Doe', 'Mike Chen', 'Tom Rodriguez'],
      location: 'Virtual',
      meetingLink: 'https://zoom.us/j/123456789',
      agenda: ['Project overview', 'Requirements review', 'Timeline discussion', 'Q&A']
    },
    {
      id: '3',
      title: 'Performance Review',
      description: 'Quarterly performance review meeting',
      date: '2024-01-18',
      time: '15:30',
      duration: 45,
      type: 'one-time',
      status: 'completed',
      organizer: 'Jane Smith',
      attendees: ['John Doe'],
      location: 'Manager Office',
      meetingLink: null,
      agenda: ['Performance discussion', 'Goal setting', 'Career development']
    },
    {
      id: '4',
      title: 'Client Presentation',
      description: 'Present project progress to client',
      date: '2024-01-25',
      time: '11:00',
      duration: 90,
      type: 'one-time',
      status: 'upcoming',
      organizer: 'Sarah Davis',
      attendees: ['John Doe', 'Alice Johnson', 'Client Team'],
      location: 'Virtual',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      agenda: ['Progress overview', 'Demo', 'Feedback session', 'Next steps']
    }
  ];

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      return meeting.date === new Date().toISOString().split('T')[0];
    }
    return meeting.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'recurring':
        return 'bg-purple-100 text-purple-800';
      case 'one-time':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isToday = (date) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const isPast = (date, time) => {
    const meetingDateTime = new Date(`${date}T${time}`);
    return meetingDateTime < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Meetings</h1>
          <p className="text-gray-600">Manage your meetings and schedule</p>
        </div>
        <button
          onClick={() => setShowAddMeeting(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            </div>
            <Video className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">
                {meetings.filter(m => m.status === 'upcoming').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">
                {meetings.filter(m => isToday(m.date)).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">
                {meetings.filter(m => {
                  const meetingDate = new Date(m.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return meetingDate >= today && meetingDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(meeting.type)}`}>
                    {meeting.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{meeting.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.time} ({meeting.duration} min)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Organizer: {meeting.organizer}</span>
                  </div>
                </div>
              </div>
              
              {meeting.status === 'upcoming' && !isPast(meeting.date, meeting.time) && (
                <div className="flex items-center space-x-2">
                  {meeting.meetingLink && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      Join Meeting
                    </button>
                  )}
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attendees</h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <p className="text-sm text-gray-600">{meeting.location}</p>
                {meeting.meetingLink && (
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 text-sm"
                  >
                    Meeting Link
                  </a>
                )}
              </div>
            </div>

            {/* Agenda */}
            {meeting.agenda && meeting.agenda.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
                <ul className="list-disc list-inside space-y-1">
                  {meeting.agenda.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'You don\'t have any meetings scheduled.' 
              : `No ${filter} meetings found.`}
          </p>
          <button
            onClick={() => setShowAddMeeting(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Schedule Your First Meeting
          </button>
        </div>
      )}

      {/* Add Meeting Modal Placeholder */}
      {showAddMeeting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Meeting</h3>
            <p className="text-gray-600 mb-4">Meeting scheduling form would go here.</p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddMeeting(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddMeeting(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeetings;