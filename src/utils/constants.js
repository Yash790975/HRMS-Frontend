export const USER_ROLES = {
  HR: 'HR',
  MANAGER: 'Manager',
  TEAM_LEAD: 'Team Lead',
  JUNIOR_DEVELOPER: 'Junior Developer',
  IT_TEAM_MEMBER: 'IT Team Member',
  EMPLOYEE: 'Employee',
  FINANCE_TEAM_MEMBER: 'Finance Team Member'
};

// Predefined users with their credentials and roles
export const USERS_DATABASE = {
  'admin': { password: 'password', designation: 'HR', fullName: 'Admin User' },
  'manager1': { password: 'manager123', designation: 'Manager', fullName: 'John Manager' },
  'teamlead1': { password: 'lead123', designation: 'Team Lead', fullName: 'Sarah Lead' },
  'dev1': { password: 'dev123', designation: 'Junior Developer', fullName: 'Mike Developer' },
  'it1': { password: 'it1234', designation: 'IT Team Member', fullName: 'Alex IT' },
  'emp1': { password: 'emp123', designation: 'Employee', fullName: 'Jane Employee' },
  'finance1': { password: 'finance123', designation: 'Finance Team Member', fullName: 'Lisa Finance' },
  'hr1': { password: 'hr123', designation: 'HR', fullName: 'Emma HR' },
  'hr2': { password: 'hr456', designation: 'HR', fullName: 'David HR' }
};

export const EMPLOYMENT_STATUS = {
  PROBATIONARY: 'Probationary Period',
  PERMANENT: 'Permanent',
  CONTRACT: 'Contract',
  INTERN: 'Intern'
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];

export const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DEPARTMENTS = [
  'Human Resources',
  'Information Technology',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Service',
  'Research & Development',
  'Legal',
  'Administration'
];

export const DESIGNATIONS = [
  // 'Junior Executive',
  // 'Executive',
  // 'Senior Executive',
  // 'Assistant Manager',
  // 'Manager',
  // 'Senior Manager',
  // 'General Manager',
  // 'Deputy General Manager',
  // 'Chief Manager',
  // 'Director'

  'Software Developer',
  'Senior Developer',
  'Team Lead',
  'Project Manager',
  'Business Analyst',
  'QA Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Analyst',
  'Marketing Executive',
  'Sales Executive',
  'HR Executive',
  'Finance Executive',
  'Customer Support Executive',
  'Operations Executive'
];

export const RELATIONSHIP_OPTIONS = [
  'Father',
  'Mother',
  'Spouse',
  'Brother',
  'Sister',
  'Son',
  'Daughter',
  'Friend',
  'Colleague',
  'Other'
];

export const RECRUITMENT_SOURCES = [
  'Portal',
  'Referral',
  'Campus',
  'Walk-in',
  'Consultant',
  'Social Media',
  'Job Fair',
  'Internal',
  'Other'
];

export const EMPLOYEE_STATUS = {
  NOT_DECIDED: 'Not Decided',
  PROBATIONARY: 'Probationary',
  PERMANENT: 'Permanent'
};

export const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Emergency Leave',
  'Casual Leave',
  'Compensatory Leave'
];

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  LATE: 'Late',
  WORK_FROM_HOME: 'Work From Home'
};

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Accommodation',
  'Transportation',
  'Office Supplies',
  'Training',
  'Communication',
  'Other'
];

export const EXPENSE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  REIMBURSED: 'Reimbursed'
};

export const ASSET_TYPES = [
  'Laptop',
  'Desktop',
  'Mobile Phone',
  'Tablet',
  'Monitor',
  'Keyboard',
  'Mouse',
  'Headphones',
  'Printer',
  'Other'
];

export const ASSET_STATUS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  MAINTENANCE: 'Under Maintenance',
  RETIRED: 'Retired'
};

export const BENEFIT_TYPES = [
  'Health Insurance',
  'Life Insurance',
  'Provident Fund',
  'Gratuity',
  'Bonus',
  'Performance Incentive',
  'Travel Allowance',
  'Medical Allowance',
  'Other'
];