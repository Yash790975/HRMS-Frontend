
  import { useState, useEffect } from 'react';
import { EmployeeMasterAPI } from '../../../api/employeeMaster';
import { EmployeePassportDetailsAPI } from '../../../api/employeePassportDetails';
import { EmployeeSkillsAPI } from '../../../api/employeeSkills'; 
import { DepartmentsAPI } from '../../../api/departments';
import { DesignationsAPI } from '../../../api/designations';
import { OfficeLocationsAPI } from '../../../api/officeLocations';
import { EmployeeRolesAPI } from '../../../api/employeeRoles';
import EmployeePriorExperience from './EmployeePriorExperience';  
import './EmployeeModal.css';
import EmployeeFamilyDetails from './EmployeeFamilyDetails'; 
import EmployeeInsuranceDetails from './EmployeeInsuranceDetails';
import EmployeeReferences from './EmployeeReferences';
import EmployeeSkills from './EmployeeSkills';
import EmployeeBankDetails from './EmployeeBankDetails';
import EmployeeDocumentChecklist from './EmployeeDocumentChecklist';

// const EmployeeModal = ({ isOpen, onClose, employeeId = null }) => {
const EmployeeModal = ({ isOpen, onClose, employeeId = null, type = 'add', hideSearch = false }) => {
  const [currentTab, setCurrentTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedEmployeeId, setSavedEmployeeId] = useState(employeeId);
  const [searchMobile, setSearchMobile] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isProbationEnabled, setIsProbationEnabled] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    employee: {
      employee_mobile_number: '',
      alternate_mobile_number: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      birth_place: '',
      date_of_birth: '',
      age: '',
      blood_group: '',
      marital_status: '',
      spouse_name: '',
      aadhaar_number: '',
      pan_number: '',
      personal_email: '',
      alternative_email: '',
      nationality: '',
      religion: '',
      hobbies: '',
      current_full_address: '',
      current_city: '',
      current_district: '',
      current_state: '',
      current_country: '',
      current_pin_code: '',
      permanent_full_address: '',
      permanent_city: '',
      permanent_district: '',
      permanent_state: '',
      permanent_country: '',
      permanent_pin_code: '',
      emergency_contact_name1: '',
      emergency_contact_relationship1: '',
      emergency_contact_number1: '',
      emergency_contact_name2: '',
      emergency_contact_relationship2: '',
      emergency_contact_number2: ''
    },
    employment: {
      date_of_joining: '',
      department_id: '',
      designation_id: '',
      reporting_location: '',
      role_id: '',
      employment_type: '',
      work_location_type: '',
      probation_period_days: '',
      probation_start_date: '',
      probation_end_date: '',
      official_email: '',
      previous_experience: '',
      overall_experience: ''
    },
    passport: {
      id: null,
      passport_number: '',
      place_of_issue: '',
      date_of_issue: '',
      date_of_expiry: ''
    },
  });


  // Add this new state at the top with your other useState declarations
const [completedTabs, setCompletedTabs] = useState({
  personal: false,
  passport: false,
  skills: false,
  experience: false,
  family: false,
  insurance: false,
  references: false,
  bank: false,
  documents: false
});

// Update the completion status when data is saved successfully
const markTabAsCompleted = (tabId) => {
  setCompletedTabs(prev => ({
    ...prev,
    [tabId]: true
  }));
};

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: '👤' },
    { id: 'passport', label: 'Passport Details', icon: '📄' },
    { id: 'skills', label: 'Skills', icon: '💼' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'family', label: 'Family Details', icon: '👨‍👩‍👧‍👦' },
    { id: 'insurance', label: 'Insurance Details', icon: '🏥' },
    { id: 'references', label: 'References', icon: '👥' },
    { id: 'bank', label: 'Bank Account Details', icon: '🏦' },
    
    
    { id: 'documents', label: 'Document Upload', icon: '📎' },
    
    // { id: 'education', label: 'Educational Background', icon: '🎓' },
  ];

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchDropdownData();
  //     if (savedEmployeeId) {
  //       fetchEmployeeData();
  //       fetchPassportData();
  //       // fetchSkillsData();
  //     }
  //   }
  // }, [isOpen, savedEmployeeId]);

useEffect(() => {
  if (isOpen) {
    fetchDropdownData();

    // Auto-load data when employeeId is provided (edit mode)
    if (employeeId) {
      setSavedEmployeeId(employeeId);
      setIsUpdateMode(true);
      fetchEmployeeData(employeeId);
      fetchPassportData(employeeId);
    } 
    // else if (savedEmployeeId) {
    //   fetchEmployeeData(savedEmployeeId);
    //   fetchPassportData(savedEmployeeId);
    // }
  }
}, [isOpen, employeeId]);

useEffect(() => {
  const hasProbationData = 
    formData.employment.probation_period_days ||
    formData.employment.probation_start_date ||
    formData.employment.probation_end_date;
  
  if (hasProbationData) {
    setIsProbationEnabled(true);
  }
}, [formData.employment.probation_period_days, formData.employment.probation_start_date, formData.employment.probation_end_date]);



  const fetchDropdownData = async () => {
    try {
      const [deptRes, desigRes, locRes, roleRes] = await Promise.all([
        DepartmentsAPI.getAll(),
        DesignationsAPI.getAll(),
        OfficeLocationsAPI.getAll(),
        EmployeeRolesAPI.getAll()
      ]);

      if (deptRes.success) setDepartments(deptRes.result || []);
      if (desigRes.success) setDesignations(desigRes.result || []);
      if (locRes.success) setOfficeLocations(locRes.result || []);
      if (roleRes.success) setRoles(roleRes.result || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      showErrorWithRetry('Failed to load form data. Please try again.');
    }
  };

  // NEW: Search employee by mobile number
  const handleMobileSearch = async () => {
    if (!searchMobile || searchMobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setIsSearching(true);
      const response = await EmployeeMasterAPI.getByMobile(searchMobile);

      if (response.success && response.result) {
        const employee = response.result;
        
        // Employee found - populate all fields
        setFormData(prev => ({
          ...prev,
          employee: {
            employee_mobile_number: employee.employee_mobile_number || '',
            alternate_mobile_number: employee.alternate_mobile_number || '',
            first_name: employee.first_name || '',
            middle_name: employee.middle_name || '',
            last_name: employee.last_name || '',
            gender: employee.gender || '',
            birth_place: employee.birth_place || '',
            date_of_birth: employee.date_of_birth || '',
            age: employee.age || '',
            blood_group: employee.blood_group || '',
            marital_status: employee.marital_status || '',
            spouse_name: employee.spouse_name || '',
            aadhaar_number: employee.aadhaar_number || '',
            pan_number: employee.pan_number || '',
            personal_email: employee.personal_email || '',
            alternative_email: employee.alternative_email || '',
            nationality: employee.nationality || '',
            religion: employee.religion || '',
            hobbies: employee.hobbies || '',
            current_full_address: employee.current_full_address || '',
            current_city: employee.current_city || '',
            current_district: employee.current_district || '',
            current_state: employee.current_state || '',
            current_country: employee.current_country || '',
            current_pin_code: employee.current_pin_code || '',
            permanent_full_address: employee.permanent_full_address || '',
            permanent_city: employee.permanent_city || '',
            permanent_district: employee.permanent_district || '',
            permanent_state: employee.permanent_state || '',
            permanent_country: employee.permanent_country || '',
            permanent_pin_code: employee.permanent_pin_code || '',
            emergency_contact_name1: employee.emergency_contact_name1 || '',
            emergency_contact_relationship1: employee.emergency_contact_relationship1 || '',
            emergency_contact_number1: employee.emergency_contact_number1 || '',
            emergency_contact_name2: employee.emergency_contact_name2 || '',
            emergency_contact_relationship2: employee.emergency_contact_relationship2 || '',
            emergency_contact_number2: employee.emergency_contact_number2 || ''
          },
          employment: {
            date_of_joining: employee.employment_details?.date_of_joining || '',
            department_id: employee.employment_details?.department_id || '',
            designation_id: employee.employment_details?.designation_id || '',
            reporting_location: employee.employment_details?.reporting_location || '',
            role_id: employee.employment_details?.role_id || '',
            employment_type: employee.employment_details?.employment_type || '',
            work_location_type: employee.employment_details?.work_location_type || '',
            probation_period_days: employee.employment_details?.probation_period_days || '',
            probation_start_date: employee.employment_details?.probation_start_date || '',
            probation_end_date: employee.employment_details?.probation_end_date || '',
            official_email: employee.employment_details?.official_email || '',
            previous_experience: employee.employment_details?.previous_experience || '',
            overall_experience: employee.employment_details?.overall_experience || ''
          }
        }));

        // Set employee ID and update mode
        const employeeIdFromResponse = employee.employee_id || employee.id;
        setSavedEmployeeId(employeeIdFromResponse);
        setIsUpdateMode(true);

        // Fetch passport and skills data
        fetchPassportData(employeeIdFromResponse);
        // fetchSkillsData(employeeIdFromResponse);

        alert('Employee data loaded successfully! You are now in UPDATE mode.');
      } else {
        // Employee not found
        setIsUpdateMode(false);
        alert('No employee found with this mobile number. You can add a new employee.');
      }
    } catch (error) {
      console.error('Error searching employee:', error);
      showErrorWithRetry('Failed to search employee. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };


  // 1. Add a handler function for document completion (add this with your other handler functions)
const handleDocumentCompletion = () => {
  markTabAsCompleted('documents');
  alert('All documents saved/updated successfully! 🎉');
  // Close the modal after a brief delay to allow the alert to be read
  setTimeout(() => {
    onClose();
  }, 100);
};
  // const fetchEmployeeData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await EmployeeMasterAPI.getById(savedEmployeeId);
  const fetchEmployeeData = async (empId = savedEmployeeId) => {
      if (!empId) {
        console.log('No employee ID provided');
        return;
      }

      try {
        setIsLoading(true);
        const response = await EmployeeMasterAPI.getById(empId);

      if (response.success) {
        const employee = response.result;
        setFormData(prev => ({
          ...prev,
          employee: {
            employee_mobile_number: employee.employee_mobile_number || '',
            alternate_mobile_number: employee.alternate_mobile_number || '',
            first_name: employee.first_name || '',
            middle_name: employee.middle_name || '',
            last_name: employee.last_name || '',
            gender: employee.gender || '',
            birth_place: employee.birth_place || '',
            date_of_birth: employee.date_of_birth || '',
            age: employee.age || '',
            blood_group: employee.blood_group || '',
            marital_status: employee.marital_status || '',
            spouse_name: employee.spouse_name || '',
            aadhaar_number: employee.aadhaar_number || '',
            pan_number: employee.pan_number || '',
            personal_email: employee.personal_email || '',
            alternative_email: employee.alternative_email || '',
            nationality: employee.nationality || '',
            religion: employee.religion || '',
            hobbies: employee.hobbies || '',
            current_full_address: employee.current_full_address || '',
            current_city: employee.current_city || '',
            current_district: employee.current_district || '',
            current_state: employee.current_state || '',
            current_country: employee.current_country || '',
            current_pin_code: employee.current_pin_code || '',
            permanent_full_address: employee.permanent_full_address || '',
            permanent_city: employee.permanent_city || '',
            permanent_district: employee.permanent_district || '',
            permanent_state: employee.permanent_state || '',
            permanent_country: employee.permanent_country || '',
            permanent_pin_code: employee.permanent_pin_code || '',
            emergency_contact_name1: employee.emergency_contact_name1 || '',
            emergency_contact_relationship1: employee.emergency_contact_relationship1 || '',
            emergency_contact_number1: employee.emergency_contact_number1 || '',
            emergency_contact_name2: employee.emergency_contact_name2 || '',
            emergency_contact_relationship2: employee.emergency_contact_relationship2 || '',
            emergency_contact_number2: employee.emergency_contact_number2 || ''
          },
          employment: {
            date_of_joining: employee.employment_details?.date_of_joining || '',
            department_id: employee.employment_details?.department_id || '',
            designation_id: employee.employment_details?.designation_id || '',
            reporting_location: employee.employment_details?.reporting_location || '',
            role_id: employee.employment_details?.role_id || '',
            employment_type: employee.employment_details?.employment_type || '',
            work_location_type: employee.employment_details?.work_location_type || '',
            probation_period_days: employee.employment_details?.probation_period_days || '',
            probation_start_date: employee.employment_details?.probation_start_date || '',
            probation_end_date: employee.employment_details?.probation_end_date || '',
            official_email: employee.employment_details?.official_email || '',
            previous_experience: employee.employment_details?.previous_experience || '',
            overall_experience: employee.employment_details?.overall_experience || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      showErrorWithRetry('Failed to load employee data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPassportData = async (empId = savedEmployeeId) => {
    if (!empId) {
      console.log('No employee ID provided for passport fetch');
      return;
    }
    
    try {
      console.log('Fetching passport data for employee:', empId);
      const response = await EmployeePassportDetailsAPI.getByEmployeeId(empId);

      console.log('Passport API Response:', response);

      if (response.success && response.result) {
        const passportData = {
          // id: response.result.id || null,
           id: response.result.passport_id || response.result.id || null,
          passport_number: response.result.passport_number || '',
          place_of_issue: response.result.place_of_issue || '',
          date_of_issue: response.result.date_of_issue || '',
          date_of_expiry: response.result.date_of_expiry || ''
        };
        
        console.log('Setting passport data:', passportData);
        
        setFormData(prev => ({
          ...prev,
          passport: passportData
        }));
      } else {
        console.log('No passport data found for employee');
        // Reset passport data if not found
        setFormData(prev => ({
          ...prev,
          passport: {
            id: null,
            passport_number: '',
            place_of_issue: '',
            date_of_issue: '',
            date_of_expiry: ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching passport data:', error);
      // Reset passport data on error
      setFormData(prev => ({
        ...prev,
        passport: {
          id: null,
          passport_number: '',
          place_of_issue: '',
          date_of_issue: '',
          date_of_expiry: ''
        }
      }));
    }
  };

  

  const showErrorWithRetry = (message) => {
    const retry = window.confirm(`${message}\n\nServer might be unavailable. Do you want to retry?`);
    if (retry) {
      window.location.reload();
    }
  };



// ============= INPUT CHANGE HANDLER (UPDATED) =============
const handleInputChange = (section, field, value) => {
  
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }
  ));
  // }

  if (errors[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }
};

  const validatePersonalDetails = () => {
    const newErrors = {};
    const { employee, employment } = formData;

    if (!employee.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!employee.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!employee.employee_mobile_number?.trim()) newErrors.employee_mobile_number = 'Mobile number is required';
    if (!employee.gender) newErrors.gender = 'Gender is required';
    if (!employee.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!employee.personal_email?.trim()) newErrors.personal_email = 'Personal email is required';

    if (!employment.date_of_joining) newErrors.date_of_joining = 'Date of joining is required';
    if (!employment.department_id) newErrors.department_id = 'Department is required';
    if (!employment.designation_id) newErrors.designation_id = 'Designation is required';
    if (!employment.reporting_location) newErrors.reporting_location = 'Reporting location is required';
    if (!employment.role_id) newErrors.role_id = 'Role is required';
    if (!employment.employment_type) newErrors.employment_type = 'Employment type is required';
    if (!employment.work_location_type) newErrors.work_location_type = 'Work location type is required';
    if (!employment.official_email?.trim()) newErrors.official_email = 'Official email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassportDetails = () => {
    const newErrors = {};
    const { passport } = formData;
    
    // if (!passport.passport_number?.trim()) {
    //   newErrors.passport_number = 'Passport number is required';
    // }
    // if (!passport.place_of_issue?.trim()) {
    //   newErrors.place_of_issue = 'Place of issue is required';
    // }
    // if (!passport.date_of_issue) {
    //   newErrors.date_of_issue = 'Date of issue is required';
    // }
    // if (!passport.date_of_expiry) {
    //   newErrors.date_of_expiry = 'Date of expiry is required';
    // }

    // if (passport.date_of_issue && passport.date_of_expiry) {
    //   const issueDate = new Date(passport.date_of_issue);
    //   const expiryDate = new Date(passport.date_of_expiry);

    //   if (expiryDate <= issueDate) {
    //     newErrors.date_of_expiry = 'Expiry date must be after issue date';
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============= MODIFIED handleNext function =============
const handleNext = async () => {
  
  if (currentTab === 'personal') {
    if (!validatePersonalDetails()) {
      return;
    }

    try {
      setIsLoading(true);
      let response;

      // 🔥 Fix: convert "" → null before sending to backend
      const sanitizedEmployment = {
        ...formData.employment,
        probation_period_days:
          formData.employment.probation_period_days === "" ||
          formData.employment.probation_period_days === undefined
            ? null
            : formData.employment.probation_period_days
      };

      if (savedEmployeeId) {
        const employeeData = {
          employee: {
            ...formData.employee,
            employee_id: savedEmployeeId
          },
          employment: sanitizedEmployment
        };
        response = await EmployeeMasterAPI.update(employeeData);
      } else {
        const employeeData = {
          employee: formData.employee,
          employment: sanitizedEmployment
        };
        response = await EmployeeMasterAPI.add(employeeData);
      }

      if (response.success) {
        const employeeIdFromResponse = response.result?.employee?.employee_id ||
                                      response.result?.employee?.id ||
                                      savedEmployeeId;

        if (!employeeIdFromResponse) {
          showErrorWithRetry('Failed to get employee ID from response');
          return;
        }

        setSavedEmployeeId(employeeIdFromResponse);
        setIsUpdateMode(true);
        markTabAsCompleted('personal');
        setCurrentTab('passport');
      } else {
        showErrorWithRetry(response.message || 'Failed to save personal details');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      showErrorWithRetry(error.message || 'Backend server is not responding');
    } finally {
      setIsLoading(false);
    }
  } 
  
  else if (currentTab === 'passport') {
    if (!savedEmployeeId) {
      alert('Please save personal details first');
      setCurrentTab('personal');
      return;
    }

    // 🔥 Check if all passport fields are empty - if yes, skip this tab
    const isPassportEmpty = !formData.passport.passport_number?.trim() &&
                            !formData.passport.place_of_issue?.trim() &&
                            !formData.passport.date_of_issue &&
                            !formData.passport.date_of_expiry;

    if (isPassportEmpty) {
      // Skip passport details and move to next tab
      markTabAsCompleted('passport');
      setCurrentTab('skills');
      return;
    }

    // If any field is filled, validate all required fields
    if (!validatePassportDetails()) {
      return;
    }

    try {
      setIsLoading(true);
      let passportData;
      let isUpdate = false;

      // 🔥 Helper function to convert empty strings to null
      const sanitizeValue = (value) => {
        return value && value.trim() !== '' ? value : null;
      };

      if (formData.passport.id && formData.passport.id !== null) {
        isUpdate = true;
        passportData = {
          passport_id: formData.passport.id,
          employee_id: savedEmployeeId,
          passport_number: sanitizeValue(formData.passport.passport_number),
          place_of_issue: sanitizeValue(formData.passport.place_of_issue),
          date_of_issue: sanitizeValue(formData.passport.date_of_issue),
          date_of_expiry: sanitizeValue(formData.passport.date_of_expiry)
        };
      } else {
        passportData = {
          employee_id: savedEmployeeId,
          passport_number: sanitizeValue(formData.passport.passport_number),
          place_of_issue: sanitizeValue(formData.passport.place_of_issue),
          date_of_issue: sanitizeValue(formData.passport.date_of_issue),
          date_of_expiry: sanitizeValue(formData.passport.date_of_expiry)
        };
      }

      const response = isUpdate
        ? await EmployeePassportDetailsAPI.update(passportData)
        : await EmployeePassportDetailsAPI.add(passportData);

      if (response.success) {
        if (response.result?.id && !isUpdate) {
          setFormData(prev => ({
            ...prev,
            passport: {
              ...prev.passport,
              id: response.result.id
            }
          }));
        }
        markTabAsCompleted('passport');
        setCurrentTab('skills');
      } else {
        showErrorWithRetry(response.message || 'Failed to save passport details');
      }
    } catch (error) {
      console.error('Error saving passport details:', error);
      const errorMessage = error.message || '';
      if (errorMessage.includes('already exists')) {
        alert('This passport number already exists in the system. Please use a different passport number or update the existing record.');
      } else {
        showErrorWithRetry(errorMessage || 'Backend server is not responding');
      }
    } finally {
      setIsLoading(false);
    }
  }
};


  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      onClose();
    }
  };

  const getFullName = () => {
    const { first_name, middle_name, last_name } = formData.employee;
    return [first_name, middle_name, last_name].filter(Boolean).join(' ');
  };

  if (!isOpen) return null;

  return (
    <div style={{marginTop: "0px"}} className="employee-modal-overlay mt-0">
      <div style={{width: "100%", maxWidth: "100%", height: "100vh", borderRadius: "0px"}} className="employee-modal px-0 md:px-5">
        <div className="employee-modal-header">
          <div className="header-content">
            <div className="header-icon">👤</div>
            <div className="header-text">
              <h2>Pre-Onboarding Form {isUpdateMode && <span style={{color: '#ff9800'}}>(UPDATE MODE)</span>}</h2>
              <p>Progress {currentTab === 'personal' ? '9' : currentTab === 'passport' ? '18' : '27'}%</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="employee-modal-body">
          <div className="sidebar">
            {/* // ============= MODIFIED Sidebar Rendering ============= */}
            {tabs.map(tab => {
              const isAccessible =
                tab.id === 'personal' ||
                (tab.id === 'passport' && savedEmployeeId) ||
                (tab.id === 'skills' && savedEmployeeId) ||
                (tab.id === 'experience' && savedEmployeeId) ||
                (tab.id === 'family' && savedEmployeeId) ||
                (tab.id === 'insurance' && savedEmployeeId) ||
                (tab.id === 'references' && savedEmployeeId) ||
                (tab.id === 'bank' && savedEmployeeId) ||
                (tab.id === 'documents' && savedEmployeeId);

              // ✅ Check completion status from state
              const isCompleted = completedTabs[tab.id];

              return (
                <div
                  key={tab.id}
                  className={`sidebar-item hover-sidebar-tab-bg ${currentTab === tab.id ? 'active' : ''} ${!isAccessible ? 'disabled' : ''} `}
                  onClick={() => isAccessible && setCurrentTab(tab.id)}
                >
                  <span className="sidebar-icon">{tab.icon}</span>
                  <div className="sidebar-text ">
                    <div className="sidebar-label">{tab.label}</div>
                    <div className="sidebar-status">{isCompleted ? 'Completed' : 'Pending'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="content-area">
            {/* {currentTab === 'personal' && (
              <div className="form-section">
                <div className="section-header">
                  <h3>Personal Details</h3>
                  <p>Step 1 of 11</p>
                </div>

                
                <div style={{
                  background: '#f0f7ff',
                  padding: '20px', */}
            {currentTab === 'personal' && (
  <div className="form-section">
    <div className="section-header">
      <h3>Personal Details</h3>
      <p>Step 1 of 11</p>
    </div>

    {/* NEW: Mobile Number Search Field - Only show when NOT editing */}
    {!hideSearch && (
                <div style={{
                  background: '#f0f7ff',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #2196F3'
                }}>
                  <h4 style={{marginTop: 0, color: '#1976d2'}}>🔍 Search Existing Employee</h4>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                    <div style={{flex: 1}}>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                        Enter Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        value={searchMobile}
                        onChange={(e) => setSearchMobile(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <button
                      onClick={handleMobileSearch}
                      disabled={isSearching || searchMobile.length !== 10}
                      style={{
                        marginTop: '28px',
                        padding: '10px 20px',
                        background: searchMobile.length === 10 ? '#2196F3' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: searchMobile.length === 10 ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold'
                      }}
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  <p style={{marginBottom: 0, marginTop: '10px', fontSize: '14px', color: '#666'}}>
                    💡 Enter mobile number to check if employee already exists. If found, data will be loaded for updating.
                  </p>
                </div>
             )}

                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.employee.first_name}
                      onChange={(e) => handleInputChange('employee', 'first_name', e.target.value)}
                      className={errors.first_name ? 'error' : ''}
                    />
                    {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      placeholder="Enter middle name"
                      value={formData.employee.middle_name}
                      onChange={(e) => handleInputChange('employee', 'middle_name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={formData.employee.last_name}
                      onChange={(e) => handleInputChange('employee', 'last_name', e.target.value)}
                      className={errors.last_name ? 'error' : ''}
                    />
                    {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Full Name (Auto-populated)</label>
                    <input
                      type="text"
                      placeholder="Full name will be auto-populated"
                      value={getFullName()}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.employee.gender}
                      onChange={(e) => handleInputChange('employee', 'gender', e.target.value)}
                      className={errors.gender ? 'error' : ''}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label>Birth Place</label>
                    <input
                      type="text"
                      placeholder="Enter birth place"
                      value={formData.employee.birth_place}
                      onChange={(e) => handleInputChange('employee', 'birth_place', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>DOB in Records</label>
                    <input
                      type="date"
                      value={formData.employee.date_of_birth}
                      onChange={(e) => handleInputChange('employee', 'date_of_birth', e.target.value)}
                      className={errors.date_of_birth ? 'error' : ''}
                    />
                    {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      placeholder="Age will be calculated"
                      value={formData.employee.age}
                      onChange={(e) => handleInputChange('employee', 'age', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      value={formData.employee.blood_group}
                      onChange={(e) => handleInputChange('employee', 'blood_group', e.target.value)}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marital Status</label>
                    <select
                      value={formData.employee.marital_status}
                      onChange={(e) => handleInputChange('employee', 'marital_status', e.target.value)}
                    >
                      <option value="">Select Marital Status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="DIVORCED">Divorced</option>
                      <option value="WIDOWED">Widowed</option>
                    </select>
                  </div>

                  {formData.employee.marital_status === 'MARRIED' && (
                    <div className="form-group">
                      <label>Spouse Name</label>
                      <input
                        type="text"
                        placeholder="Enter spouse name"
                        value={formData.employee.spouse_name}
                        onChange={(e) => handleInputChange('employee', 'spouse_name', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength="12"
                      value={formData.employee.aadhaar_number}
                      onChange={(e) => handleInputChange('employee', 'aadhaar_number', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength="10"
                      value={formData.employee.employee_mobile_number}
                      onChange={(e) => handleInputChange('employee', 'employee_mobile_number', e.target.value)}
                      className={errors.employee_mobile_number ? 'error' : ''}
                    />
                    {errors.employee_mobile_number && <span className="error-message">{errors.employee_mobile_number}</span>}
                  </div>

                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      placeholder="Enter PAN number (e.g., ABCDE1234F)"
                      maxLength="10"
                      value={formData.employee.pan_number}
                      onChange={(e) => handleInputChange('employee', 'pan_number', e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="form-group">
                    <label>Personal Email ID *</label>
                    <input
                      type="email"
                      placeholder="Enter personal email"
                      value={formData.employee.personal_email}
                      onChange={(e) => handleInputChange('employee', 'personal_email', e.target.value)}
                      className={errors.personal_email ? 'error' : ''}
                    />
                    {errors.personal_email && <span className="error-message">{errors.personal_email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Alternative Email ID</label>
                    <input
                      type="email"
                      placeholder="Enter alternative email"
                      value={formData.employee.alternative_email}
                      onChange={(e) => handleInputChange('employee', 'alternative_email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      placeholder="Indian"
                      value={formData.employee.nationality}
                      onChange={(e) => handleInputChange('employee', 'nationality', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Religion</label>
                    <input
                      type="text"
                      placeholder="Hindu"
                      value={formData.employee.religion}
                      onChange={(e) => handleInputChange('employee', 'religion', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Hobbies</label>
                    <input
                      type="text"
                      placeholder="Cricket, Reading"
                      value={formData.employee.hobbies}
                      onChange={(e) => handleInputChange('employee', 'hobbies', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Full Address</label>
                    <input
                      type="text"
                      placeholder="7789 Green Park, New Delhi"
                      value={formData.employee.current_full_address}
                      onChange={(e) => handleInputChange('employee', 'current_full_address', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current City</label>
                    <input
                      type="text"
                      placeholder="New Delhi"
                      value={formData.employee.current_city}
                      onChange={(e) => handleInputChange('employee', 'current_city', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current District</label>
                    <input
                      type="text"
                      placeholder="South Delhi"
                      value={formData.employee.current_district}
                      onChange={(e) => handleInputChange('employee', 'current_district', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current State</label>
                    <input
                      type="text"
                      placeholder="Delhi"
                      value={formData.employee.current_state}
                      onChange={(e) => handleInputChange('employee', 'current_state', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Country</label>
                    <input
                      type="text"
                      placeholder="India"
                      value={formData.employee.current_country}
                      onChange={(e) => handleInputChange('employee', 'current_country', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Pincode</label>
                    <input
                      type="text"
                      placeholder="110016"
                      maxLength="6"
                      value={formData.employee.current_pin_code}
                      onChange={(e) => handleInputChange('employee', 'current_pin_code', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent Full Address</label>
                    <input
                      type="text"
                      placeholder="456 Model Town, Delhi"
                      value={formData.employee.permanent_full_address}
                      onChange={(e) => handleInputChange('employee', 'permanent_full_address', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent City</label>
                    <input
                      type="text"
                      placeholder="Delhi"
                      value={formData.employee.permanent_city}
                      onChange={(e) => handleInputChange('employee', 'permanent_city', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent District</label>
                    <input
                      type="text"
                      placeholder="North Delhi"
                      value={formData.employee.permanent_district}
                      onChange={(e) => handleInputChange('employee', 'permanent_district', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent State</label>
                    <input
                      type="text"
                      placeholder="North Delhi"
                      value={formData.employee.permanent_state}
                      onChange={(e) => handleInputChange('employee', 'permanent_state', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent Country</label>
                    <input
                      type="text"
                      placeholder="India"
                      value={formData.employee.permanent_country}
                      onChange={(e) => handleInputChange('employee', 'permanent_country', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Permanent Pincode</label>
                    <input
                      type="text"
                      placeholder="110009"
                      maxLength="6"
                      value={formData.employee.permanent_pin_code}
                      onChange={(e) => handleInputChange('employee', 'permanent_pin_code', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Name1</label>
                    <input
                      type="text"
                      placeholder="Enter Your Emergency Contact Name1"
                      value={formData.employee.emergency_contact_name1}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_name1', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Relationship1</label>
                    <input
                      type="text"
                      placeholder="Enter Your Emergency Contact Relationship1"
                      value={formData.employee.emergency_contact_relationship1}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_relationship1', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Number1</label>
                    <input
                      type="tel"
                      placeholder="Enter Your Emergency Contact Number1"
                      maxLength="10"
                      value={formData.employee.emergency_contact_number1}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_number1', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Name2</label>
                    <input
                      type="text"
                      placeholder="Enter Your Emergency Contact Name2"
                      value={formData.employee.emergency_contact_name2}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_name2', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Relationship2</label>
                    <input
                      type="text"
                      placeholder="Enter Your Emergency Contact Relationship2"
                      value={formData.employee.emergency_contact_relationship2}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_relationship2', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Number2</label>
                    <input
                      type="tel"
                      placeholder="Enter Your Emergency Contact Number2"
                      maxLength="10"
                      value={formData.employee.emergency_contact_number2}
                      onChange={(e) => handleInputChange('employee', 'emergency_contact_number2', e.target.value)}
                    />
                  </div>
                </div>

                <div className="section-divider">
                  <h3>Employee Employment Details</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Date of Joining *</label>
                    <input
                      type="date"
                      value={formData.employment.date_of_joining}
                      onChange={(e) => handleInputChange('employment', 'date_of_joining', e.target.value)}
                      className={errors.date_of_joining ? 'error' : ''}
                    />
                    {errors.date_of_joining && <span className="error-message">{errors.date_of_joining}</span>}
                  </div>

                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      value={formData.employment.department_id}
                      onChange={(e) => handleInputChange('employment', 'department_id', e.target.value)}
                      className={errors.department_id ? 'error' : ''}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    {errors.department_id && <span className="error-message">{errors.department_id}</span>}
                  </div>

                  <div className="form-group">
                    <label>Designation *</label>
                    <select
                      value={formData.employment.designation_id}
                      onChange={(e) => handleInputChange('employment', 'designation_id', e.target.value)}
                      className={errors.designation_id ? 'error' : ''}
                    >
                      <option value="">Select Designation</option>
                      {designations.map(desig => (
                        <option key={desig.id} value={desig.id}>{desig.name}</option>
                      ))}
                    </select>
                    {errors.designation_id && <span className="error-message">{errors.designation_id}</span>}
                  </div>

                  <div className="form-group">
                    <label>Reporting Location *</label>
                    <select
                      value={formData.employment.reporting_location}
                      onChange={(e) => handleInputChange('employment', 'reporting_location', e.target.value)}
                      className={errors.reporting_location ? 'error' : ''}
                    >
                      <option value="">Select Location</option>
                      {officeLocations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                    {errors.reporting_location && <span className="error-message">{errors.reporting_location}</span>}
                  </div>

                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      value={formData.employment.role_id}
                      onChange={(e) => handleInputChange('employment', 'role_id', e.target.value)}
                      className={errors.role_id ? 'error' : ''}
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                      ))}
                    </select>
                    {errors.role_id && <span className="error-message">{errors.role_id}</span>}
                  </div>

                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select
                      value={formData.employment.employment_type}
                      onChange={(e) => handleInputChange('employment', 'employment_type', e.target.value)}
                      className={errors.employment_type ? 'error' : ''}
                    >
                      <option value="">Full Time</option>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERN">Intern</option>
                    </select>
                    {errors.employment_type && <span className="error-message">{errors.employment_type}</span>}
                  </div>

                  <div className="form-group">
                    <label>Work Location Type *</label>
                    <select
                      value={formData.employment.work_location_type}
                      onChange={(e) => handleInputChange('employment', 'work_location_type', e.target.value)}
                      className={errors.work_location_type ? 'error' : ''}
                    >
                      <option value="">Onsite</option>
                      <option value="ONSITE">Onsite</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                    {errors.work_location_type && <span className="error-message">{errors.work_location_type}</span>}
                  </div>
{/* 
                  <div className="form-group">
                    <label>Probation Period (Days)</label>
                    <input
                      type="number"
                      placeholder="90"
                      value={formData.employment.probation_period_days}
                      onChange={(e) => handleInputChange('employment', 'probation_period_days', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Probation Start Date</label>
                    <input
                      type="date"
                      value={formData.employment.probation_start_date}
                      onChange={(e) => handleInputChange('employment', 'probation_start_date', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Probation End Date</label>
                    <input
                      type="date"
                      value={formData.employment.probation_end_date}
                      onChange={(e) => handleInputChange('employment', 'probation_end_date', e.target.value)}
                    />
                  </div> */}
                  <div className="form-group full-width">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <input
      type="checkbox"
      id="probationCheckbox"
      checked={isProbationEnabled}
      onChange={(e) => {
        setIsProbationEnabled(e.target.checked);
        // Clear probation fields when unchecked
        if (!e.target.checked) {
          handleInputChange('employment', 'probation_period_days', '');
          handleInputChange('employment', 'probation_start_date', '');
          handleInputChange('employment', 'probation_end_date', '');
        }
      }}
      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
    />
    <label htmlFor="probationCheckbox" style={{ cursor: 'pointer', fontWeight: 'bold', margin: 0 }}>
      Enable Probation Period
    </label>
  </div>
</div>

{isProbationEnabled && (
  <>
    <div className="form-group">
      <label>Probation Period (Days)</label>
      <input
        type="number"
        placeholder="90"
        value={formData.employment.probation_period_days}
        onChange={(e) => handleInputChange('employment', 'probation_period_days', e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Probation Start Date</label>
      <input
        type="date"
        value={formData.employment.probation_start_date}
        onChange={(e) => handleInputChange('employment', 'probation_start_date', e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Probation End Date</label>
      <input
        type="date"
        value={formData.employment.probation_end_date}
        onChange={(e) => handleInputChange('employment', 'probation_end_date', e.target.value)}
      />
    </div>
  </>
)}

                  <div className="form-group">
                    <label>Official Email *</label>
                    <input
                      type="email"
                      placeholder="employee@company.com"
                      value={formData.employment.official_email}
                      onChange={(e) => handleInputChange('employment', 'official_email', e.target.value)}
                      className={errors.official_email ? 'error' : ''}
                    />
                    {errors.official_email && <span className="error-message">{errors.official_email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Previous Experience (Years)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      value={formData.employment.previous_experience}
                      onChange={(e) => handleInputChange('employment', 'previous_experience', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Overall Experience (Years)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={formData.employment.overall_experience}
                      onChange={(e) => handleInputChange('employment', 'overall_experience', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (isUpdateMode ? 'Update & Next →' : 'Save & Next →')}
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'passport' && (
              <div className="form-section">
                <div className="section-header">
                  <h3>Passport Details</h3>
                  <p>Step 2 of 11</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Passport Number *</label>
                    <input
                      type="text"
                      placeholder="Z1234567"
                      value={formData.passport.passport_number}
                      onChange={(e) => handleInputChange('passport', 'passport_number', e.target.value.toUpperCase())}
                      className={errors.passport_number ? 'error' : ''}
                    />
                    {errors.passport_number && <span className="error-message">{errors.passport_number}</span>}
                  </div>

                  <div className="form-group">
                    <label>Place of Issue *</label>
                    <input
                      type="text"
                      placeholder="New Delhi"
                      value={formData.passport.place_of_issue}
                      onChange={(e) => handleInputChange('passport', 'place_of_issue', e.target.value)}
                      className={errors.place_of_issue ? 'error' : ''}
                    />
                    {errors.place_of_issue && <span className="error-message">{errors.place_of_issue}</span>}
                  </div>

                  <div className="form-group">
                    <label>Date of Issue *</label>
                    <input
                      type="date"
                      value={formData.passport.date_of_issue}
                      onChange={(e) => handleInputChange('passport', 'date_of_issue', e.target.value)}
                      className={errors.date_of_issue ? 'error' : ''}
                    />
                    {errors.date_of_issue && <span className="error-message">{errors.date_of_issue}</span>}
                  </div>

                  <div className="form-group">
                    <label>Date of Expiry *</label>
                    <input
                      type="date"
                      value={formData.passport.date_of_expiry}
                      onChange={(e) => handleInputChange('passport', 'date_of_expiry', e.target.value)}
                      className={errors.date_of_expiry ? 'error' : ''}
                    />
                    {errors.date_of_expiry && <span className="error-message">{errors.date_of_expiry}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setCurrentTab('personal')}>
                    ← Back
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (formData.passport.id ? 'Update & Next →' : 'Save & Next →')}
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'skills' && (
                <EmployeeSkills
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={() => setCurrentTab('experience')}
                  onComplete={() => markTabAsCompleted('skills')} // ✅ Add this
                />
              )}

              {currentTab === 'experience' && (
                <EmployeePriorExperience
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={() => setCurrentTab('family')}
                  onComplete={() => markTabAsCompleted('experience')} // ✅ Add this
                />
              )}

              {currentTab === 'family' && (
                <EmployeeFamilyDetails
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading} 
                  onNextTab={() => setCurrentTab('insurance')}
                  onComplete={() => markTabAsCompleted('family')} // ✅ Add this
                  maritalStatus={formData.employee.marital_status} // Add this line
                />
              )}

              {currentTab === 'insurance' && (
                <EmployeeInsuranceDetails
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={() => setCurrentTab('references')}
                  onComplete={() => markTabAsCompleted('insurance')} // ✅ Add this
                />
              )}

              {currentTab === 'references' && (
                <EmployeeReferences
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={() => setCurrentTab('bank')}
                  onComplete={() => markTabAsCompleted('references')} // ✅ Add this
                />
              )}

              {currentTab === 'bank' && (
                <EmployeeBankDetails
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={() => setCurrentTab('documents')}
                  onComplete={() => markTabAsCompleted('bank')} // ✅ Add this
                />
              )}


              {currentTab === 'documents' && (
                <EmployeeDocumentChecklist
                  employeeId={savedEmployeeId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onNextTab={handleDocumentCompletion}
                  // onComplete={handleDocumentCompletion}
                />
              )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
