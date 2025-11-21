import { useState, useEffect } from 'react';
import { EmployeePassportDetailsAPI } from '../../../api/employeePassportDetails';

const EmployeePassportDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [errors, setErrors] = useState({});
  const [passportDetails, setPassportDetails] = useState({
    id: null,
    passport_number: '',
    place_of_issue: '',
    date_of_issue: '',
    date_of_expiry: ''
  });

  // Fetch passport details when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchPassportData();
    }
  }, [employeeId]);

  const fetchPassportData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for passport fetch');
      return;
    }
    
    try {
      console.log('Fetching passport data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeePassportDetailsAPI.getByEmployeeId(employeeId);

      console.log('Passport API Response:', response);

      if (response.success && response.result) {
        const passportData = {
          id: response.result.passport_id || response.result.id || null,
          passport_number: response.result.passport_number || '',
          place_of_issue: response.result.place_of_issue || '',
          date_of_issue: response.result.date_of_issue || '',
          date_of_expiry: response.result.date_of_expiry || ''
        };
        
        console.log('Setting passport data:', passportData);
        setPassportDetails(passportData);
      } else {
        console.log('No passport data found for employee');
        resetPassportDetails();
      }
    } catch (error) {
      console.error('Error fetching passport data:', error);
      resetPassportDetails();
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassportDetails = () => {
    setPassportDetails({
      id: null,
      passport_number: '',
      place_of_issue: '',
      date_of_issue: '',
      date_of_expiry: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await savePassportDetails();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.(); // Mark this tab as completed
      onNextTab(); // Move to next tab
    }
  };

  const handleInputChange = (field, value) => {
    setPassportDetails(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Helper function to convert empty strings to null
  const sanitizeValue = (value) => {
    return value && value.trim() !== '' ? value : null;
  };

  // Sanitize passport data before sending
  const sanitizePassportData = (data) => {
    return {
      ...data,
      passport_number: sanitizeValue(data.passport_number),
      place_of_issue: sanitizeValue(data.place_of_issue),
      date_of_issue: sanitizeValue(data.date_of_issue),
      date_of_expiry: sanitizeValue(data.date_of_expiry)
    };
  };

  // Updated validation - make fields optional
  const validatePassportDetails = () => {
    const newErrors = {};

    // Check if at least one field is filled
    const hasAnyData = 
      passportDetails.passport_number?.trim() ||
      passportDetails.place_of_issue?.trim() ||
      passportDetails.date_of_issue ||
      passportDetails.date_of_expiry;

    if (hasAnyData) {
      // If user started filling, validate required fields
      if (!passportDetails.passport_number?.trim()) {
        newErrors.passport_number = 'Passport number is required';
      }

      if (!passportDetails.place_of_issue?.trim()) {
        newErrors.place_of_issue = 'Place of issue is required';
      }

      if (!passportDetails.date_of_issue) {
        newErrors.date_of_issue = 'Date of issue is required';
      }

      if (!passportDetails.date_of_expiry) {
        newErrors.date_of_expiry = 'Date of expiry is required';
      }

      // Validate expiry date is after issue date
      if (passportDetails.date_of_issue && passportDetails.date_of_expiry) {
        const issueDate = new Date(passportDetails.date_of_issue);
        const expiryDate = new Date(passportDetails.date_of_expiry);

        if (expiryDate <= issueDate) {
          newErrors.date_of_expiry = 'Expiry date must be after issue date';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePassportDetails = async () => {
    if (!validatePassportDetails()) {
      return false;
    }

    if (!employeeId) {
      alert('Please save personal details first');
      return false;
    }

    // Check if form is completely empty - allow skipping
    const hasAnyData = 
      passportDetails.passport_number?.trim() ||
      passportDetails.place_of_issue?.trim() ||
      passportDetails.date_of_issue ||
      passportDetails.date_of_expiry;

    if (!hasAnyData) {
      // Form is empty, just move to next tab
      return true;
    }

    try {
      setIsLoading(true);
      let isUpdate = passportDetails.id !== null;

      console.log('Current passport details:', passportDetails);
      console.log('Is Update?', isUpdate);

      // Sanitize the data before sending
      let passportData = sanitizePassportData({
        employee_id: employeeId,
        passport_number: passportDetails.passport_number,
        place_of_issue: passportDetails.place_of_issue,
        date_of_issue: passportDetails.date_of_issue,
        date_of_expiry: passportDetails.date_of_expiry
      });

      if (isUpdate) {
        // For UPDATE, add passport_id
        passportData.passport_id = passportDetails.id;
        console.log('Updating passport details with ID:', passportDetails.id);
        console.log('Passport Details Update Data:', passportData);
      } else {
        // For ADD, no passport_id needed
        console.log('Adding new passport details');
        console.log('Passport Details Add Data:', passportData);
      }

      const response = isUpdate
        ? await EmployeePassportDetailsAPI.update(passportData)
        : await EmployeePassportDetailsAPI.add(passportData);

      if (response.success) {
        if (!isUpdate) {
          // After adding, update the id in state
          setPassportDetails(prev => ({
            ...prev,
            id: response.result?.passport_id || response.result?.id
          }));
        }
        
        return true;
      } else {
        alert(response.message || 'Failed to save passport details');
        return false;
      }
    } catch (error) {
      console.error('Error saving passport details:', error);
      const errorMessage = error.message || '';
      if (errorMessage.includes('already exists')) {
        alert('This passport number already exists in the system. Please use a different passport number or update the existing record.');
      } else {
        alert(errorMessage || 'Backend server is not responding');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePassportDetails = async () => {
    if (!passportDetails.id) {
      alert('Cannot delete unsaved passport details');
      return;
    }

    if (!window.confirm('Are you sure you want to delete these passport details?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await EmployeePassportDetailsAPI.delete(passportDetails.id);

      if (response.success) {
        resetPassportDetails();
        alert('Passport details deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete passport details');
      }
    } catch (error) {
      console.error('Error deleting passport details:', error);
      alert('Failed to delete passport details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="passport-details-section p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="passport-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">Passport Details</h3>
        <p className="text-sm text-gray-600 mt-1">Enter employee passport information (Optional - Skip if not applicable)</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Passport Number
          </label>
          <input
            type="text"
            value={passportDetails.passport_number}
            onChange={(e) => handleInputChange('passport_number', e.target.value.toUpperCase())}
            placeholder="Z1234567"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.passport_number && <span className="text-red-500 text-sm">{errors.passport_number}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Place of Issue
          </label>
          <input
            type="text"
            value={passportDetails.place_of_issue}
            onChange={(e) => handleInputChange('place_of_issue', e.target.value)}
            placeholder="New Delhi"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.place_of_issue && <span className="text-red-500 text-sm">{errors.place_of_issue}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Date of Issue
          </label>
          <input
            type="date"
            value={passportDetails.date_of_issue}
            onChange={(e) => handleInputChange('date_of_issue', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.date_of_issue && <span className="text-red-500 text-sm">{errors.date_of_issue}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Date of Expiry
          </label>
          <input
            type="date"
            value={passportDetails.date_of_expiry}
            onChange={(e) => handleInputChange('date_of_expiry', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.date_of_expiry && <span className="text-red-500 text-sm">{errors.date_of_expiry}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="passport-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={savePassportDetails}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : passportDetails.id ? 'Update Passport Details' : 'Save Passport Details'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {passportDetails.id && (
            <button
              type="button"
              onClick={handleDeletePassportDetails}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="passport-info mt-6 text-gray-700 text-sm">
        <p>Status: {passportDetails.id ? 'Passport details saved' : 'No passport details saved yet (optional)'}</p>
      </div>
    </div>
  );
};

export default EmployeePassportDetails;