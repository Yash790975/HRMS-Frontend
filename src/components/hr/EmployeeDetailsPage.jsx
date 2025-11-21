import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  Car, 
  Gift, 
  FileText,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Building,
  Users
} from 'lucide-react';
import { getFromStorage } from '../../utils/localStorage';
import { formatDate, formatCurrency } from '../../utils/helpers';
import EmployeeDetailsView from './onboarding/EmployeeDetailsView';


const EmployeeDetailsPage = ({ employeeId, onBack, onEdit }) => {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

  const loadEmployee = () => {
    try {
      const employees = getFromStorage('employees') || [];
      const foundEmployee = employees.find(emp => emp.id === employeeId);
      setEmployee(foundEmployee);
    } catch (error) {
      console.error('Error loading employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showFullDetails) {
    return (
      <EmployeeDetailsView
        employee={employee}
        onBack={() => setShowFullDetails(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Not Found</h2>
        <p className="text-gray-600 mb-4">The requested employee could not be found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const managementCards = [
    {
      id: 'attendance',
      title: 'Attendance Management',
      icon: Clock,
      color: 'bg-blue-600',
      stats: {
        present: 22,
        absent: 2,
        late: 1,
        percentage: '91.7%'
      }
    },
    {
      id: 'leave',
      title: 'Leave Management',
      icon: Calendar,
      color: 'bg-green-600',
      stats: {
        available: 18,
        used: 7,
        pending: 1,
        total: 25
      }
    },
    {
      id: 'payroll',
      title: 'Payroll Details',
      icon: DollarSign,
      color: 'bg-purple-600',
      stats: {
        salary: '₹50,000',
        bonus: '₹5,000',
        deductions: '₹2,500',
        net: '₹52,500'
      }
    },
    {
      id: 'expenses',
      title: 'Expenses Management',
      icon: FileText,
      color: 'bg-orange-600',
      stats: {
        submitted: 3,
        approved: 2,
        pending: 1,
        total: '₹15,000'
      }
    },
    {
      id: 'assets',
      title: 'Assets Management',
      icon: Car,
      color: 'bg-indigo-600',
      stats: {
        laptop: 1,
        mobile: 1,
        accessories: 3,
        total: 5
      }
    },
    {
      id: 'benefits',
      title: 'Benefits Management',
      icon: Gift,
      color: 'bg-pink-600',
      stats: {
        health: 'Active',
        pf: 'Active',
        insurance: 'Active',
        gym: 'Inactive'
      }
    }
  ];

  return (
    <div style={{zIndex: "0"}} className="p-6 space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
            <p className="text-gray-600 mt-1">Comprehensive employee information and management</p>
          </div>
        </div>
      </div>

      {/* Employee Basic Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
          <div className="flex items-center space-x-4 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{employee.personalDetails?.fullName || 'N/A'}</h2>
              <p className="text-orange-100">{employee.employmentDetails?.designation || 'N/A'}</p>
              <p className="text-orange-100 text-sm">ID: {employee.employmentDetails?.employeeId || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{employee.personalDetails?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{employee.personalDetails?.mobileNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{employee.employmentDetails?.department || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    View Details
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{card.title}</h3>
                
                <div className="space-y-2">
                  {Object.entries(card.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{key}:</span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Joining Date</p>
              <p className="font-medium">{formatDate(employee.employmentDetails?.joiningDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reporting Manager</p>
              <p className="font-medium">{employee.employmentDetails?.reportingManager || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Work Location</p>
              <p className="font-medium">{employee.employmentDetails?.workLocation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.employmentDetails?.probationPeriod 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {employee.employmentDetails?.probationPeriod ? 'On Probation' : 'Permanent'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowFullDetails(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2 inline-block" />
          View More
        </button>
        <button
          onClick={() => onEdit(employee)}
          // onClick={() => alert('hlooooooooooooooooooooooooooooooooooooooo')}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2 inline-block" />
          Edit Employee
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 te xt-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;