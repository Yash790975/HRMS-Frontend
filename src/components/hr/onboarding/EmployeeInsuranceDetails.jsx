
import { useState, useEffect } from 'react';
import { EmployeeInsuranceDetailsAPI } from '../../../api/employeeInsuranceDetails';

const EmployeeInsuranceDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [errors, setErrors] = useState({});
  const [insuranceDetails, setInsuranceDetails] = useState({
    insurance_id: null,
    self_name: '',
    self_dob: '', 
    self_age: '',
    self_gender: '',
    marital_status: '' 
  });

  // Fetch insurance details when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchInsuranceDetailsData();
    }
  }, [employeeId]);

  const fetchInsuranceDetailsData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for insurance details fetch');
      return;
    }
    
    try {
      console.log('Fetching insurance details data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeInsuranceDetailsAPI.getByEmployeeId(employeeId);

      console.log('Insurance Details API Response:', response);

      if (response.success && response.result) {
        // Since it's a single object, not an array
        const insuranceData = {
          insurance_id: response.result.insurance_id || response.result.id || null,
          self_name: response.result.self_name || '',
          self_dob: response.result.self_dob || '',
          self_age: response.result.self_age || '',
          self_gender: response.result.self_gender || '',
          marital_status: response.result.marital_status || ''
        };
        
        console.log('Setting insurance details:', insuranceData);
        setInsuranceDetails(insuranceData);
      } else {
        console.log('No insurance details data found for employee');
        resetInsuranceDetails();
      }
    } catch (error) {
      console.error('Error fetching insurance details data:', error);
      resetInsuranceDetails();
    } finally {
      setIsLoading(false);
    }
  };

  const resetInsuranceDetails = () => {
    setInsuranceDetails({
      insurance_id: null,
      self_name: '',
      self_dob: '',
      self_age: '',
      self_gender: '',
      marital_status: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await saveInsuranceDetails();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.(); // ✅ Mark this tab as completed
      onNextTab(); // move to next tab
    }
  };

  const handleInputChange = (field, value) => {
    setInsuranceDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate age when DOB changes
    if (field === 'self_dob' && value) {
      const age = calculateAge(value);
      setInsuranceDetails(prev => ({
        ...prev,
        self_age: age
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // 🔥 Helper function to sanitize data before sending
  const sanitizeInsuranceData = (data) => {
    return {
      ...data,
      self_name: data.self_name?.trim() || null,
      self_dob: data.self_dob?.trim() || null,
      self_age: data.self_age ? parseInt(data.self_age) : null,
      self_gender: data.self_gender || null,
      marital_status: data.marital_status || null
    };
  };

  // 🔥 Updated validation - make fields optional
  const validateInsuranceDetails = () => {
    const newErrors = {};

    // Only validate if at least one field is filled
    const hasAnyData = 
      insuranceDetails.self_name?.trim() ||
      insuranceDetails.self_dob?.trim() ||
      insuranceDetails.self_age?.toString().trim() ||
      insuranceDetails.self_gender ||
      insuranceDetails.marital_status;

    if (hasAnyData) {
      // If user started filling, validate required fields
      if (!insuranceDetails.self_name?.trim()) {
        newErrors.self_name = 'Name is required';
      }

      if (!insuranceDetails.self_dob?.trim()) {
        newErrors.self_dob = 'Date of birth is required';
      }

      if (!insuranceDetails.self_age?.toString().trim()) {
        newErrors.self_age = 'Age is required';
      } else {
        const age = parseInt(insuranceDetails.self_age);
        if (isNaN(age) || age < 0 || age > 150) {
          newErrors.self_age = 'Age must be a valid number between 0 and 150';
        }
      }

      if (!insuranceDetails.self_gender) {
        newErrors.self_gender = 'Gender is required';
      }

      if (!insuranceDetails.marital_status) {
        newErrors.marital_status = 'Marital status is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveInsuranceDetails = async () => {
    if (!validateInsuranceDetails()) {
      return false;
    }

    if (!employeeId) {
      alert('Please save personal details first');
      return false;
    }

    // 🔥 Check if form is completely empty - allow skipping
    const hasAnyData = 
      insuranceDetails.self_name?.trim() ||
      insuranceDetails.self_dob?.trim() ||
      insuranceDetails.self_age?.toString().trim() ||
      insuranceDetails.self_gender ||
      insuranceDetails.marital_status;

    if (!hasAnyData) {
      // Form is empty, just move to next tab
      return true;
    }

    try {
      setIsLoading(true);
      let isUpdate = insuranceDetails.insurance_id !== null;

      console.log('Current insurance details:', insuranceDetails);
      console.log('Is Update?', isUpdate);

      // 🔥 Sanitize the data before sending
      let insuranceData = sanitizeInsuranceData({
        employee_id: employeeId,
        self_name: insuranceDetails.self_name,
        self_dob: insuranceDetails.self_dob,
        self_age: insuranceDetails.self_age,
        self_gender: insuranceDetails.self_gender,
        marital_status: insuranceDetails.marital_status
      });

      if (isUpdate) {
        // For UPDATE, add insurance_id
        insuranceData.insurance_id = insuranceDetails.insurance_id;
        console.log('Updating insurance details with ID:', insuranceDetails.insurance_id);
        console.log('Insurance Details Update Data:', insuranceData);
      } else {
        // For ADD, no insurance_id needed
        console.log('Adding new insurance details');
        console.log('Insurance Details Add Data:', insuranceData);
      }

      const response = isUpdate
        ? await EmployeeInsuranceDetailsAPI.update(insuranceData)
        : await EmployeeInsuranceDetailsAPI.add(insuranceData);

      if (response.success) {
        if (!isUpdate) {
          // After adding, update the insurance_id in state
          setInsuranceDetails(prev => ({
            ...prev,
            insurance_id: response.result?.insurance_id || response.result?.id
          }));
        }
        
        return true;
      } else {
        alert(response.message || 'Failed to save insurance details');
        return false;
      }
    } catch (error) {
      console.error('Error saving insurance details:', error);
      alert(error.message || 'Backend server is not responding');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInsuranceDetails = async () => {
    if (!insuranceDetails.insurance_id) {
      alert('Cannot delete unsaved insurance details');
      return;
    }

    if (!window.confirm('Are you sure you want to delete these insurance details?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await EmployeeInsuranceDetailsAPI.delete(insuranceDetails.insurance_id);

      if (response.success) {
        resetInsuranceDetails();
        alert('Insurance details deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete insurance details');
      }
    } catch (error) {
      console.error('Error deleting insurance details:', error);
      alert('Failed to delete insurance details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="insurance-details-section p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="insurance-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">Insurance Details</h3>
        <p className="text-sm text-gray-600 mt-1">Enter employee insurance information (Optional - Skip if not applicable)</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={insuranceDetails.self_name}
            onChange={(e) => handleInputChange('self_name', e.target.value)}
            placeholder="Enter full name"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.self_name && <span className="text-red-500 text-sm">{errors.self_name}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={insuranceDetails.self_dob}
            onChange={(e) => handleInputChange('self_dob', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.self_dob && <span className="text-red-500 text-sm">{errors.self_dob}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            value={insuranceDetails.self_age}
            onChange={(e) => handleInputChange('self_age', e.target.value)}
            placeholder="Age (auto-calculated from DOB)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 bg-gray-50"
          />
          {errors.self_age && <span className="text-red-500 text-sm">{errors.self_age}</span>}
          <small className="text-gray-500 text-xs block mt-1">
            Age is automatically calculated when you enter date of birth
          </small>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Gender
          </label>
          <select
            value={insuranceDetails.self_gender}
            onChange={(e) => handleInputChange('self_gender', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          {errors.self_gender && <span className="text-red-500 text-sm">{errors.self_gender}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Marital Status
          </label>
          <select
            value={insuranceDetails.marital_status}
            onChange={(e) => handleInputChange('marital_status', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            <option value="">Select Marital Status</option>
            <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="DIVORCED">Divorced</option>
            <option value="WIDOWED">Widowed</option>
          </select>
          {errors.marital_status && <span className="text-red-500 text-sm">{errors.marital_status}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="insurance-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveInsuranceDetails}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : insuranceDetails.insurance_id ? 'Update Insurance Details' : 'Save Insurance Details'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {insuranceDetails.insurance_id && (
            <button
              type="button"
              onClick={handleDeleteInsuranceDetails}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )} 
        </div>
      </div>

      {/* Info Display */}
      <div className="insurance-info mt-6 text-gray-700 text-sm">
        <p>Status: {insuranceDetails.insurance_id ? 'Insurance details saved' : 'No insurance details saved yet (optional)'}</p>
      </div>
    </div>
  );
};

export default EmployeeInsuranceDetails;   