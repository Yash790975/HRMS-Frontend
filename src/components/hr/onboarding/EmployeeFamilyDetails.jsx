import { useState, useEffect } from 'react';
import { EmployeeFamilyDetailsAPI } from '../../../api/employeeFamilyDetails';
import Modal from './AlertModal';

const EmployeeFamilyDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete, maritalStatus  }) => {
  const [errors, setErrors] = useState({});
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false
  });
  const [familyDetails, setFamilyDetails] = useState({
    family_id: null,
    fathers_full_name: '',
    fathers_dob: '',
    fathers_occupation: '',
    mothers_full_name: '',
    mothers_dob: '',
    mothers_occupation: '',
    spouse_full_name: '',
    spouse_dob: '',
    spouse_occupation: ''
  });

  // Helper function to show modal
  const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Fetch family details when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchFamilyDetailsData();
    }
  }, [employeeId]);

  const fetchFamilyDetailsData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for family details fetch');
      return;
    }
    
    try {
      console.log('Fetching family details data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeFamilyDetailsAPI.getByEmployeeId(employeeId);

      console.log('Family Details API Response:', response);

      if (response.success && response.result) {
        const familyData = {
          family_id: response.result.family_id || response.result.id || null,
          fathers_full_name: response.result.fathers_full_name || '',
          fathers_dob: response.result.fathers_dob || '',
          fathers_occupation: response.result.fathers_occupation || '',
          mothers_full_name: response.result.mothers_full_name || '',
          mothers_dob: response.result.mothers_dob || '',
          mothers_occupation: response.result.mothers_occupation || '',
          spouse_full_name: response.result.spouse_full_name || '',
          spouse_dob: response.result.spouse_dob || '',
          spouse_occupation: response.result.spouse_occupation || ''
        };
        
        console.log('Setting family details:', familyData);
        setFamilyDetails(familyData);
      } else {
        console.log('No family details data found for employee');
        resetFamilyDetails();
      }
    } catch (error) {
      console.error('Error fetching family details data:', error);
      resetFamilyDetails();
    } finally {
      setIsLoading(false);
    }
  };

  const resetFamilyDetails = () => {
    setFamilyDetails({
      family_id: null,
      fathers_full_name: '',
      fathers_dob: '',
      fathers_occupation: '',
      mothers_full_name: '',
      mothers_dob: '',
      mothers_occupation: '',
      spouse_full_name: '',
      spouse_dob: '',
      spouse_occupation: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await saveFamilyDetails();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleInputChange = (field, value) => {
    setFamilyDetails(prev => ({
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

  const validateFamilyDetails = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveFamilyDetails = async () => {
    if (!validateFamilyDetails()) {
      return false;
    }

    if (!employeeId) {
      showModal('Error', 'Please save personal details first', 'error');
      return false;
    }

    try {
      setIsLoading(true);
      let familyData;
      let isUpdate = familyDetails.family_id !== null;

      console.log('Current family details:', familyDetails);
      console.log('Is Update?', isUpdate);

      familyData = {
        employee_id: employeeId,
        fathers_full_name: familyDetails.fathers_full_name,
        fathers_dob: familyDetails.fathers_dob || null,
        fathers_occupation: familyDetails.fathers_occupation,

        mothers_full_name: familyDetails.mothers_full_name,
        mothers_dob: familyDetails.mothers_dob || null,
        mothers_occupation: familyDetails.mothers_occupation,

        spouse_full_name: familyDetails.spouse_full_name || '',
        spouse_dob: familyDetails.spouse_dob || null,
        spouse_occupation: familyDetails.spouse_occupation || ''
      };

      if (isUpdate) {
        familyData.family_id = familyDetails.family_id;
        console.log('Updating family details with ID:', familyDetails.family_id);
        console.log('Family Details Update Data:', familyData);
      } else {
        console.log('Adding new family details');
        console.log('Family Details Add Data:', familyData);
      }

      const response = isUpdate
        ? await EmployeeFamilyDetailsAPI.update(familyData)
        : await EmployeeFamilyDetailsAPI.add(familyData);

      if (response.success) {
        if (!isUpdate) {
          setFamilyDetails(prev => ({
            ...prev,
            family_id: response.result?.family_id || response.result?.id
          }));
        }
        
        showModal(
          'Success', 
          `Family details ${isUpdate ? 'updated' : 'added'} successfully!`, 
          'success'
        );
        return true;
      } else {
        showModal('Error', response.message || 'Failed to save family details', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving family details:', error);
      showModal('Error', error.message || 'Backend server is not responding', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFamilyDetails = async () => {
    if (!familyDetails.family_id) {
      showModal('Error', 'Cannot delete unsaved family details', 'error');
      return;
    }

    showModal(
      'Confirm Delete',
      'Are you sure you want to delete these family details?',
      'warning',
      async () => {
        try {
          setIsLoading(true);
          const response = await EmployeeFamilyDetailsAPI.delete(familyDetails.family_id);

          if (response.success) {
            resetFamilyDetails();
            showModal('Success', 'Family details deleted successfully!', 'success');
          } else {
            showModal('Error', response.message || 'Failed to delete family details', 'error');
          }
        } catch (error) {
          console.error('Error deleting family details:', error);
          showModal('Error', 'Failed to delete family details', 'error');
        } finally {
          setIsLoading(false);
        }
        closeModal();
      },
      true
    );
  };

  return (
    <div className="family-details-section p-6 bg-white rounded-2xl shadow-md">
      {/* Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        showCancel={modalConfig.showCancel}
      />

      {/* Header */}
      <div className="family-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">Family Details</h3>
        <p className="text-sm text-gray-600 mt-1">Enter family member information</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Details Section */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Father's Details</h4>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Father's Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={familyDetails.fathers_full_name}
            onChange={(e) => handleInputChange('fathers_full_name', e.target.value)}
            placeholder="Enter father's full name"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.fathers_full_name && <span className="text-red-500 text-sm">{errors.fathers_full_name}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Father's Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={familyDetails.fathers_dob}
            onChange={(e) => handleInputChange('fathers_dob', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.fathers_dob && <span className="text-red-500 text-sm">{errors.fathers_dob}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Father's Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={familyDetails.fathers_occupation}
            onChange={(e) => handleInputChange('fathers_occupation', e.target.value)}
            placeholder="Enter father's occupation"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.fathers_occupation && <span className="text-red-500 text-sm">{errors.fathers_occupation}</span>}
        </div>

        {/* Mother's Details Section */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Mother's Details</h4>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Mother's Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={familyDetails.mothers_full_name}
            onChange={(e) => handleInputChange('mothers_full_name', e.target.value)}
            placeholder="Enter mother's full name"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.mothers_full_name && <span className="text-red-500 text-sm">{errors.mothers_full_name}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Mother's Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={familyDetails.mothers_dob}
            onChange={(e) => handleInputChange('mothers_dob', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.mothers_dob && <span className="text-red-500 text-sm">{errors.mothers_dob}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Mother's Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={familyDetails.mothers_occupation}
            onChange={(e) => handleInputChange('mothers_occupation', e.target.value)}
            placeholder="Enter mother's occupation"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.mothers_occupation && <span className="text-red-500 text-sm">{errors.mothers_occupation}</span>}
        </div>

        {maritalStatus === 'MARRIED' && (
          <>
            <div className="md:col-span-2 mt-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Spouse Details
              </h4>
            </div>

            <div className="form-group">
              <label className="block text-gray-700 font-medium mb-1">
                Spouse's Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={familyDetails.spouse_full_name}
                onChange={(e) => handleInputChange('spouse_full_name', e.target.value)}
                placeholder="Enter spouse's full name"
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
              {errors.spouse_full_name && <span className="text-red-500 text-sm">{errors.spouse_full_name}</span>}
            </div>

            <div className="form-group">
              <label className="block text-gray-700 font-medium mb-1">
                Spouse's Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={familyDetails.spouse_dob}
                onChange={(e) => handleInputChange('spouse_dob', e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
              {errors.spouse_dob && <span className="text-red-500 text-sm">{errors.spouse_dob}</span>}
            </div>

            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Spouse's Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={familyDetails.spouse_occupation}
                onChange={(e) => handleInputChange('spouse_occupation', e.target.value)}
                placeholder="Enter spouse's occupation"
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
              {errors.spouse_occupation && <span className="text-red-500 text-sm">{errors.spouse_occupation}</span>}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="family-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveFamilyDetails}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : familyDetails.family_id ? 'Update Family Details' : 'Save Family Details'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {familyDetails.family_id && (
            <button
              type="button"
              onClick={handleDeleteFamilyDetails}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="family-info mt-6 text-gray-700 text-sm">
        <p>Status: {familyDetails.family_id ? 'Family details saved' : 'No family details saved yet'}</p>
      </div>
    </div>
  );
};

export default EmployeeFamilyDetails;






























































// import { useState, useEffect } from 'react';
// import { EmployeeFamilyDetailsAPI } from '../../../api/employeeFamilyDetails';

// const EmployeeFamilyDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete, maritalStatus  }) => {
//   const [errors, setErrors] = useState({});
//   const [familyDetails, setFamilyDetails] = useState({
//     family_id: null,
//     fathers_full_name: '',
//     fathers_dob: '',
//     fathers_occupation: '',
//     mothers_full_name: '',
//     mothers_dob: '',
//     mothers_occupation: '',
//     spouse_full_name: '',
//     spouse_dob: '',
//     spouse_occupation: ''
//   });

//   // Fetch family details when component mounts or employeeId changes
//   useEffect(() => {
//     if (employeeId) {
//       fetchFamilyDetailsData();
//     }
//   }, [employeeId]);

//   const fetchFamilyDetailsData = async () => {
//     if (!employeeId) {
//       console.log('No employee ID provided for family details fetch');
//       return;
//     }
    
//     try {
//       console.log('Fetching family details data for employee:', employeeId);
//       setIsLoading(true);
//       const response = await EmployeeFamilyDetailsAPI.getByEmployeeId(employeeId);

//       console.log('Family Details API Response:', response);

//       if (response.success && response.result) {
//         // Since it's a single object, not an array
//         const familyData = {
//           family_id: response.result.family_id || response.result.id || null,
//           fathers_full_name: response.result.fathers_full_name || '',
//           fathers_dob: response.result.fathers_dob || '',
//           fathers_occupation: response.result.fathers_occupation || '',
//           mothers_full_name: response.result.mothers_full_name || '',
//           mothers_dob: response.result.mothers_dob || '',
//           mothers_occupation: response.result.mothers_occupation || '',
//           spouse_full_name: response.result.spouse_full_name || '',
//           spouse_dob: response.result.spouse_dob || '',
//           spouse_occupation: response.result.spouse_occupation || ''
//         };
        
//         console.log('Setting family details:', familyData);
//         setFamilyDetails(familyData);
//       } else {
//         console.log('No family details data found for employee');
//         resetFamilyDetails();
//       }
//     } catch (error) {
//       console.error('Error fetching family details data:', error);
//       resetFamilyDetails();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetFamilyDetails = () => {
//     setFamilyDetails({
//       family_id: null,
//       fathers_full_name: '',
//       fathers_dob: '',
//       fathers_occupation: '',
//       mothers_full_name: '',
//       mothers_dob: '',
//       mothers_occupation: '',
//       spouse_full_name: '',
//       spouse_dob: '',
//       spouse_occupation: ''
//     });
//   };

//   const handleSaveAndNext = async () => {
//     const saved = await saveFamilyDetails();
//     if (saved && typeof onNextTab === 'function') {
//       onComplete?.(); // ✅ Mark this tab as completed
//         // alert('Skills saved successfully!');
//       onNextTab(); // move to next tab
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFamilyDetails(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateFamilyDetails = () => {
//     const newErrors = {};

//     // Father's details validation
//     // if (!familyDetails.fathers_full_name?.trim()) {
//     //   newErrors.fathers_full_name = "Father's full name is required";
//     // }
//     // if (!familyDetails.fathers_dob?.trim()) {
//     //   newErrors.fathers_dob = "Father's date of birth is required";
//     // }
//     // if (!familyDetails.fathers_occupation?.trim()) {
//     //   newErrors.fathers_occupation = "Father's occupation is required";
//     // }

//     // Mother's details validation
//     // if (!familyDetails.mothers_full_name?.trim()) {
//     //   newErrors.mothers_full_name = "Mother's full name is required";
//     // }
//     // if (!familyDetails.mothers_dob?.trim()) {
//     //   newErrors.mothers_dob = "Mother's date of birth is required";
//     // }
//     // if (!familyDetails.mothers_occupation?.trim()) {
//     //   newErrors.mothers_occupation = "Mother's occupation is required";
//     // }

//     // Spouse details are optional, but if one field is filled, validate the others
//     // const hasAnySpouseInfo = familyDetails.spouse_full_name?.trim() || 
//     //                          familyDetails.spouse_dob?.trim() || 
//     //                          familyDetails.spouse_occupation?.trim();

//     // if (hasAnySpouseInfo) {
//     //   if (!familyDetails.spouse_full_name?.trim()) {
//     //     newErrors.spouse_full_name = "Spouse's full name is required if spouse details are provided";
//     //   }
//     //   if (!familyDetails.spouse_dob?.trim()) {
//     //     newErrors.spouse_dob = "Spouse's date of birth is required if spouse details are provided";
//     //   }
//     //   if (!familyDetails.spouse_occupation?.trim()) {
//     //     newErrors.spouse_occupation = "Spouse's occupation is required if spouse details are provided";
//     //   }
//     // }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveFamilyDetails = async () => {
//     if (!validateFamilyDetails()) {
//       return false;
//     }

//     if (!employeeId) {
//       alert('Please save personal details first');
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       let familyData;
//       let isUpdate = familyDetails.family_id !== null;

//       console.log('Current family details:', familyDetails);
//       console.log('Is Update?', isUpdate);

//       // Both ADD and UPDATE use the same structure
//       // familyData = {
//       //   employee_id: employeeId,
//       //   fathers_full_name: familyDetails.fathers_full_name,
//       //   fathers_dob: familyDetails.fathers_dob,
//       //   fathers_occupation: familyDetails.fathers_occupation,
//       //   mothers_full_name: familyDetails.mothers_full_name,
//       //   mothers_dob: familyDetails.mothers_dob,
//       //   mothers_occupation: familyDetails.mothers_occupation,
//       //   spouse_full_name: familyDetails.spouse_full_name || '',
//       //   spouse_dob: familyDetails.spouse_dob || '',
//       //   spouse_occupation: familyDetails.spouse_occupation || ''
//       // };
//       familyData = {
//         employee_id: employeeId,
//         fathers_full_name: familyDetails.fathers_full_name,
//         fathers_dob: familyDetails.fathers_dob || null,
//         fathers_occupation: familyDetails.fathers_occupation,

//         mothers_full_name: familyDetails.mothers_full_name,
//         mothers_dob: familyDetails.mothers_dob || null,
//         mothers_occupation: familyDetails.mothers_occupation,

//         spouse_full_name: familyDetails.spouse_full_name || '',
//         spouse_dob: familyDetails.spouse_dob || null,
//         spouse_occupation: familyDetails.spouse_occupation || ''
//       };


//       if (isUpdate) {
//         // For UPDATE, add family_id
//         familyData.family_id = familyDetails.family_id;
//         console.log('Updating family details with ID:', familyDetails.family_id);
//         console.log('Family Details Update Data:', familyData);
//       } else {
//         // For ADD, no family_id needed
//         console.log('Adding new family details');
//         console.log('Family Details Add Data:', familyData);
//       }

//       const response = isUpdate
//         ? await EmployeeFamilyDetailsAPI.update(familyData)
//         : await EmployeeFamilyDetailsAPI.add(familyData);

//       if (response.success) {
//         if (!isUpdate) {
//           // After adding, update the family_id in state
//           setFamilyDetails(prev => ({
//             ...prev,
//             family_id: response.result?.family_id || response.result?.id
//           }));
//         }
        
//         // alert(`Family details ${isUpdate ? 'updated' : 'added'} successfully!`);
//         return true;
//       } else {
//         alert(response.message || 'Failed to save family details');
//         return false;
//       }
//     } catch (error) {
//       console.error('Error saving family details:', error);
//       alert(error.message || 'Backend server is not responding');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteFamilyDetails = async () => {
//     if (!familyDetails.family_id) {
//       alert('Cannot delete unsaved family details');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to delete these family details?')) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await EmployeeFamilyDetailsAPI.delete(familyDetails.family_id);

//       if (response.success) {
//         resetFamilyDetails();
//         alert('Family details deleted successfully!');
//       } else {
//         alert(response.message || 'Failed to delete family details');
//       }
//     } catch (error) {
//       console.error('Error deleting family details:', error);
//       alert('Failed to delete family details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="family-details-section p-6 bg-white rounded-2xl shadow-md">
//       {/* Header */}
//       <div className="family-header mb-6 border-b pb-2">
//         <h3 className="text-2xl font-semibold text-gray-800">Family Details</h3>
//         <p className="text-sm text-gray-600 mt-1">Enter family member information</p>
//       </div>

//       {/* Form Fields */}
//       <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Father's Details Section */}
//         <div className="md:col-span-2">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Father's Details</h4>
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Father's Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={familyDetails.fathers_full_name}
//             onChange={(e) => handleInputChange('fathers_full_name', e.target.value)}
//             placeholder="Enter father's full name"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.fathers_full_name && <span className="text-red-500 text-sm">{errors.fathers_full_name}</span>}
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Father's Date of Birth <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             value={familyDetails.fathers_dob}
//             onChange={(e) => handleInputChange('fathers_dob', e.target.value)}
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.fathers_dob && <span className="text-red-500 text-sm">{errors.fathers_dob}</span>}
//         </div>

//         <div className="form-group md:col-span-2">
//           <label className="block text-gray-700 font-medium mb-1">
//             Father's Occupation <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={familyDetails.fathers_occupation}
//             onChange={(e) => handleInputChange('fathers_occupation', e.target.value)}
//             placeholder="Enter father's occupation"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.fathers_occupation && <span className="text-red-500 text-sm">{errors.fathers_occupation}</span>}
//         </div>

//         {/* Mother's Details Section */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Mother's Details</h4>
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Mother's Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={familyDetails.mothers_full_name}
//             onChange={(e) => handleInputChange('mothers_full_name', e.target.value)}
//             placeholder="Enter mother's full name"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.mothers_full_name && <span className="text-red-500 text-sm">{errors.mothers_full_name}</span>}
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Mother's Date of Birth <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             value={familyDetails.mothers_dob}
//             onChange={(e) => handleInputChange('mothers_dob', e.target.value)}
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.mothers_dob && <span className="text-red-500 text-sm">{errors.mothers_dob}</span>}
//         </div>

//         <div className="form-group md:col-span-2">
//           <label className="block text-gray-700 font-medium mb-1">
//             Mother's Occupation <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={familyDetails.mothers_occupation}
//             onChange={(e) => handleInputChange('mothers_occupation', e.target.value)}
//             placeholder="Enter mother's occupation"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.mothers_occupation && <span className="text-red-500 text-sm">{errors.mothers_occupation}</span>}
//         </div>

    
//         {maritalStatus === 'MARRIED' && (
//   <>
//     <div className="md:col-span-2 mt-4">
//       <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//         Spouse Details
//       </h4>
//     </div>

//     <div className="form-group">
//       <label className="block text-gray-700 font-medium mb-1">
//         Spouse's Full Name <span className="text-red-500">*</span>
//       </label>
//       <input
//         type="text"
//         value={familyDetails.spouse_full_name}
//         onChange={(e) => handleInputChange('spouse_full_name', e.target.value)}
//         placeholder="Enter spouse's full name"
//         disabled={isLoading}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//       />
//       {errors.spouse_full_name && <span className="text-red-500 text-sm">{errors.spouse_full_name}</span>}
//     </div>

//     <div className="form-group">
//       <label className="block text-gray-700 font-medium mb-1">
//         Spouse's Date of Birth <span className="text-red-500">*</span>
//       </label>
//       <input
//         type="date"
//         value={familyDetails.spouse_dob}
//         onChange={(e) => handleInputChange('spouse_dob', e.target.value)}
//         disabled={isLoading}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//       />
//       {errors.spouse_dob && <span className="text-red-500 text-sm">{errors.spouse_dob}</span>}
//     </div>

//     <div className="form-group md:col-span-2">
//       <label className="block text-gray-700 font-medium mb-1">
//         Spouse's Occupation <span className="text-red-500">*</span>
//       </label>
//       <input
//         type="text"
//         value={familyDetails.spouse_occupation}
//         onChange={(e) => handleInputChange('spouse_occupation', e.target.value)}
//         placeholder="Enter spouse's occupation"
//         disabled={isLoading}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//       />
//       {errors.spouse_occupation && <span className="text-red-500 text-sm">{errors.spouse_occupation}</span>}
//     </div>
//   </>
// )}
//       </div>

//       {/* Action Buttons */}
//       <div className="family-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
//         <div className="action-buttons flex flex-wrap gap-3">
//           <button
//             type="button"
//             onClick={saveFamilyDetails}
//             disabled={isLoading}
//             className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : familyDetails.family_id ? 'Update Family Details' : 'Save Family Details'}
//           </button>

//           <button
//             type="button"
//             onClick={handleSaveAndNext}
//             disabled={isLoading}
//             className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : 'Save & Next →'}
//           </button>

//           {familyDetails.family_id && (
//             <button
//               type="button"
//               onClick={handleDeleteFamilyDetails}
//               disabled={isLoading}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Info Display */}
//       <div className="family-info mt-6 text-gray-700 text-sm">
//         <p>Status: {familyDetails.family_id ? 'Family details saved' : 'No family details saved yet'}</p>
//       </div>
//     </div>
//   );
// };

// export default EmployeeFamilyDetails;