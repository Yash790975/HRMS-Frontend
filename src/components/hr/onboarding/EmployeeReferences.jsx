import { useState, useEffect } from 'react';
import { EmployeeReferenceseAPI } from '../../../api/employeeReferences';
import Modal from './AlertModal';

const EmployeeReferences = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);
  const [references, setReferences] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false
  });
  const [editingReference, setEditingReference] = useState({
    id: null,
    reference_name: '',
    reference_mobile_number: '',
    area: '',
    organization: '',
    relationship_with_reference: ''
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

  // Fetch references when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchReferencesData();
    }
  }, [employeeId]);

  const fetchReferencesData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for references fetch');
      return;
    }
    
    try {
      console.log('Fetching references data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeReferenceseAPI.getByEmployeeId(employeeId);

      console.log('References API Response:', response);

      if (response.success && response.result && Array.isArray(response.result)) {
        const referencesArray = response.result.map(ref => ({
          id: ref.reference_id || ref.id || null,
          reference_name: ref.reference_name || '',
          reference_mobile_number: ref.reference_mobile_number || '',
          area: ref.area || '',
          organization: ref.organization || '',
          relationship_with_reference: ref.relationship_with_reference || ''
        }));
        
        console.log('Setting references array:', referencesArray);
        setReferences(referencesArray);

        if (referencesArray.length > 0) {
          setEditingReference(referencesArray[0]);
          setCurrentReferenceIndex(0);
        }
      } else {
        console.log('No references data found for employee');
        setReferences([]);
        resetEditingReference();
      }
    } catch (error) {
      console.error('Error fetching references data:', error);
      setReferences([]);
      resetEditingReference();
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditingReference = () => {
    setEditingReference({
      id: null,
      reference_name: '',
      reference_mobile_number: '',
      area: '',
      organization: '',
      relationship_with_reference: ''
    });
  };

  const handleSaveAndNext = async () => {
    // Check if form is empty - allow skipping if no data entered
    const hasAnyData = 
      editingReference.reference_name?.trim() ||
      editingReference.reference_mobile_number?.trim() ||
      editingReference.area?.trim() ||
      editingReference.organization?.trim() ||
      editingReference.relationship_with_reference?.trim();

    if (!hasAnyData && references.length === 0) {
      // Form is empty and no references exist, just move to next tab
      if (typeof onNextTab === 'function') {
        onComplete?.();
        onNextTab();
      }
      return;
    }

    const saved = await saveCurrentReference();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleInputChange = (field, value) => {
    setEditingReference(prev => ({
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

  const validateReferenceDetails = () => {
    const newErrors = {};

    // Check if user has started filling any field
    const hasAnyData = 
      editingReference.reference_name?.trim() ||
      editingReference.reference_mobile_number?.trim() ||
      editingReference.area?.trim() ||
      editingReference.organization?.trim() ||
      editingReference.relationship_with_reference?.trim();

    // Only validate if user has started filling the form
    if (hasAnyData) {
      if (!editingReference.reference_name?.trim()) {
        newErrors.reference_name = 'Reference name is required';
      }

      if (!editingReference.reference_mobile_number?.trim()) {
        newErrors.reference_mobile_number = 'Mobile number is required';
      } else {
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(editingReference.reference_mobile_number.trim())) {
          newErrors.reference_mobile_number = 'Mobile number must be 10 digits';
        }
      }

      if (!editingReference.area?.trim()) {
        newErrors.area = 'Area/Domain is required';
      }

      if (!editingReference.organization?.trim()) {
        newErrors.organization = 'Organization is required';
      }

      if (!editingReference.relationship_with_reference?.trim()) {
        newErrors.relationship_with_reference = 'Relationship with reference is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrentReference = async () => {
    // Check if form is completely empty - allow skipping
    const hasAnyData = 
      editingReference.reference_name?.trim() ||
      editingReference.reference_mobile_number?.trim() ||
      editingReference.area?.trim() ||
      editingReference.organization?.trim() ||
      editingReference.relationship_with_reference?.trim();

    if (!hasAnyData) {
      // Form is empty, just return true to allow moving forward
      return true;
    }

    if (!validateReferenceDetails()) {
      return false;
    }

    if (!employeeId) {
      showModal('Error', 'Please save personal details first', 'error');
      return false;
    }

    try {
      setIsLoading(true);
      let referenceData;
      let isUpdate = editingReference.id !== null;

      console.log('Current editing reference:', editingReference);
      console.log('Is Update?', isUpdate);

      // Both ADD and UPDATE use the same structure
      referenceData = {
        employee_id: employeeId,
        reference_name: editingReference.reference_name,
        reference_mobile_number: editingReference.reference_mobile_number,
        area: editingReference.area,
        organization: editingReference.organization,
        relationship_with_reference: editingReference.relationship_with_reference
      };

      if (isUpdate) {
        // For UPDATE, add reference_id
        referenceData.reference_id = editingReference.id;
        console.log('Updating reference with ID:', editingReference.id);
        console.log('Reference Update Data:', referenceData);
      } else {
        // For ADD, no reference_id needed
        console.log('Adding new reference');
        console.log('Reference Add Data:', referenceData);
      }

      const response = isUpdate
        ? await EmployeeReferenceseAPI.update(referenceData)
        : await EmployeeReferenceseAPI.add(referenceData);

      if (response.success) {
        if (isUpdate) {
          setReferences(prev => prev.map((ref, idx) => 
            idx === currentReferenceIndex ? editingReference : ref
          ));
        } else {
          const newReference = {
            ...editingReference,
            id: response.result?.reference_id || response.result?.id
          };
          setReferences(prev => [...prev, newReference]);
          setEditingReference(newReference);
          setCurrentReferenceIndex(references.length);
        }
        
        showModal(
          'Success',
          `Reference ${isUpdate ? 'updated' : 'added'} successfully!`,
          'success'
        );
        return true;
      } else {
        showModal('Error', response.message || 'Failed to save reference details', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving reference details:', error);
      showModal('Error', error.message || 'Backend server is not responding', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousReference = () => {
    if (currentReferenceIndex > 0) {
      const prevIndex = currentReferenceIndex - 1;
      setCurrentReferenceIndex(prevIndex);
      setEditingReference(references[prevIndex]);
      setErrors({});
    }
  };

  const handleNextReference = () => {
    if (currentReferenceIndex < references.length - 1) {
      const nextIndex = currentReferenceIndex + 1;
      setCurrentReferenceIndex(nextIndex);
      setEditingReference(references[nextIndex]);
      setErrors({});
    }
  };

  const handleAddNewReference = () => {
    const newReference = {
      id: null,
      reference_name: '',
      reference_mobile_number: '',
      area: '',
      organization: '',
      relationship_with_reference: ''
    };
    setEditingReference(newReference);
    setCurrentReferenceIndex(references.length);
    setErrors({});
  };

  const handleDeleteReference = async () => {
    if (!editingReference.id) {
      showModal('Error', 'Cannot delete unsaved reference', 'error');
      return;
    }

    showModal(
      'Confirm Delete',
      'Are you sure you want to delete this reference?',
      'warning',
      async () => {
        try {
          setIsLoading(true);
          const response = await EmployeeReferenceseAPI.delete(editingReference.id);

          if (response.success) {
            const updatedReferences = references.filter((_, idx) => idx !== currentReferenceIndex);
            setReferences(updatedReferences);

            if (updatedReferences.length > 0) {
              const newIndex = Math.min(currentReferenceIndex, updatedReferences.length - 1);
              setCurrentReferenceIndex(newIndex);
              setEditingReference(updatedReferences[newIndex]);
            } else {
              handleAddNewReference();
            }

            showModal('Success', 'Reference deleted successfully!', 'success');
          } else {
            showModal('Error', response.message || 'Failed to delete reference', 'error');
          }
        } catch (error) {
          console.error('Error deleting reference:', error);
          showModal('Error', 'Failed to delete reference', 'error');
        } finally {
          setIsLoading(false);
        }
        closeModal();
      },
      true
    );
  };

  const getReferenceDisplayInfo = () => {
    const totalReferences = references.length;
    const currentNumber = currentReferenceIndex + 1;
    const isNewReference = !editingReference.id;
    
    return {
      totalReferences,
      currentNumber,
      isNewReference,
      displayText: isNewReference 
        ? `Adding New Reference (${currentNumber}/${totalReferences + 1})`
        : `Reference ${currentNumber} of ${totalReferences}`
    };
  };

  return (
    <div className="reference-section p-6 bg-white rounded-2xl shadow-md">
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

      {/* Header with navigation info */}
      <div className="reference-header mb-6 border-b pb-3">
        <h3 className="text-2xl font-semibold text-gray-800">{getReferenceDisplayInfo().displayText}</h3>
        <p className="text-sm text-gray-600 mt-1">Add employee references (Optional - Skip if not applicable)</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Reference Name
          </label>
          <input
            type="text"
            value={editingReference.reference_name}
            onChange={(e) => handleInputChange('reference_name', e.target.value)}
            placeholder="Enter reference name (e.g., Amit Kumar)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.reference_name && <span className="text-red-500 text-sm">{errors.reference_name}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            value={editingReference.reference_mobile_number}
            onChange={(e) => handleInputChange('reference_mobile_number', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.reference_mobile_number && <span className="text-red-500 text-sm">{errors.reference_mobile_number}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Area/Domain
          </label>
          <input
            type="text"
            value={editingReference.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
            placeholder="Enter area/domain (e.g., Software Development)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.area && <span className="text-red-500 text-sm">{errors.area}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Organization
          </label>
          <input
            type="text"
            value={editingReference.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            placeholder="Enter organization name"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.organization && <span className="text-red-500 text-sm">{errors.organization}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Relationship with Reference
          </label>
          <input
            type="text"
            value={editingReference.relationship_with_reference}
            onChange={(e) => handleInputChange('relationship_with_reference', e.target.value)}
            placeholder="Enter relationship (e.g., Former Team Lead, Manager)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.relationship_with_reference && (
            <span className="text-red-500 text-sm">{errors.relationship_with_reference}</span>
          )}
        </div>
      </div>

      {/* Navigation and Action Buttons */}
      <div className="reference-actions flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="navigation-buttons flex gap-3">
          <button
            type="button"
            onClick={handlePreviousReference}
            disabled={currentReferenceIndex === 0 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={handleNextReference}
            disabled={currentReferenceIndex >= references.length - 1 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>

        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAddNewReference}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + Add New Reference
          </button>

          <button
            type="button"
            onClick={saveCurrentReference}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingReference.id ? 'Update Reference' : 'Save Reference'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {editingReference.id && (
            <button
              type="button"
              onClick={handleDeleteReference}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="reference-info mt-6 text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
        <p className="font-medium">Total References: {references.length}</p>
        {references.length > 0 && (
          <p>Viewing: {currentReferenceIndex + 1} of {references.length}</p>
        )}
        <p className="text-xs text-gray-600 mt-2">
          ℹ️ References are optional. You can skip this section by clicking "Save & Next" without adding any references.
        </p>
      </div>
    </div>
  );
};

export default EmployeeReferences;






























































// import { useState, useEffect } from 'react';
// import { EmployeeReferenceseAPI } from '../../../api/employeeReferences';

// const EmployeeReferences = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
//   const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);
//   const [references, setReferences] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [editingReference, setEditingReference] = useState({
//     id: null,
//     reference_name: '',
//     reference_mobile_number: '',
//     area: '',
//     organization: '',
//     relationship_with_reference: ''
//   });

//   // Fetch references when component mounts or employeeId changes
//   useEffect(() => {
//     if (employeeId) {
//       fetchReferencesData();
//     }
//   }, [employeeId]);

//   const fetchReferencesData = async () => {
//     if (!employeeId) {
//       console.log('No employee ID provided for references fetch');
//       return;
//     }
    
//     try {
//       console.log('Fetching references data for employee:', employeeId);
//       setIsLoading(true);
//       const response = await EmployeeReferenceseAPI.getByEmployeeId(employeeId);

//       console.log('References API Response:', response);

//       if (response.success && response.result && Array.isArray(response.result)) {
//         const referencesArray = response.result.map(ref => ({
//           id: ref.reference_id || ref.id || null,
//           reference_name: ref.reference_name || '',
//           reference_mobile_number: ref.reference_mobile_number || '',
//           area: ref.area || '',
//           organization: ref.organization || '',
//           relationship_with_reference: ref.relationship_with_reference || ''
//         }));
        
//         console.log('Setting references array:', referencesArray);
//         setReferences(referencesArray);

//         if (referencesArray.length > 0) {
//           setEditingReference(referencesArray[0]);
//           setCurrentReferenceIndex(0);
//         }
//       } else {
//         console.log('No references data found for employee');
//         setReferences([]);
//         resetEditingReference();
//       }
//     } catch (error) {
//       console.error('Error fetching references data:', error);
//       setReferences([]);
//       resetEditingReference();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetEditingReference = () => {
//     setEditingReference({
//       id: null,
//       reference_name: '',
//       reference_mobile_number: '',
//       area: '',
//       organization: '',
//       relationship_with_reference: ''
//     });
//   };

//   const handleSaveAndNext = async () => {
//     // 🔥 Check if form is empty - allow skipping if no data entered
//     const hasAnyData = 
//       editingReference.reference_name?.trim() ||
//       editingReference.reference_mobile_number?.trim() ||
//       editingReference.area?.trim() ||
//       editingReference.organization?.trim() ||
//       editingReference.relationship_with_reference?.trim();

//     if (!hasAnyData && references.length === 0) {
//       // Form is empty and no references exist, just move to next tab
//       if (typeof onNextTab === 'function') {
//         onComplete?.();
//         onNextTab();
//       }
//       return;
//     }

//     const saved = await saveCurrentReference();
//     if (saved && typeof onNextTab === 'function') {
//       onComplete?.();
//       onNextTab();
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setEditingReference(prev => ({
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

//   // 🔥 Updated validation - only validate if user has started filling
//   const validateReferenceDetails = () => {
//     const newErrors = {};

//     // Check if user has started filling any field
//     const hasAnyData = 
//       editingReference.reference_name?.trim() ||
//       editingReference.reference_mobile_number?.trim() ||
//       editingReference.area?.trim() ||
//       editingReference.organization?.trim() ||
//       editingReference.relationship_with_reference?.trim();

//     // Only validate if user has started filling the form
//     if (hasAnyData) {
//       if (!editingReference.reference_name?.trim()) {
//         newErrors.reference_name = 'Reference name is required';
//       }

//       if (!editingReference.reference_mobile_number?.trim()) {
//         newErrors.reference_mobile_number = 'Mobile number is required';
//       } else {
//         const mobilePattern = /^[0-9]{10}$/;
//         if (!mobilePattern.test(editingReference.reference_mobile_number.trim())) {
//           newErrors.reference_mobile_number = 'Mobile number must be 10 digits';
//         }
//       }

//       if (!editingReference.area?.trim()) {
//         newErrors.area = 'Area/Domain is required';
//       }

//       if (!editingReference.organization?.trim()) {
//         newErrors.organization = 'Organization is required';
//       }

//       if (!editingReference.relationship_with_reference?.trim()) {
//         newErrors.relationship_with_reference = 'Relationship with reference is required';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveCurrentReference = async () => {
//     // 🔥 Check if form is completely empty - allow skipping
//     const hasAnyData = 
//       editingReference.reference_name?.trim() ||
//       editingReference.reference_mobile_number?.trim() ||
//       editingReference.area?.trim() ||
//       editingReference.organization?.trim() ||
//       editingReference.relationship_with_reference?.trim();

//     if (!hasAnyData) {
//       // Form is empty, just return true to allow moving forward
//       return true;
//     }

//     if (!validateReferenceDetails()) {
//       return false;
//     }

//     if (!employeeId) {
//       alert('Please save personal details first');
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       let referenceData;
//       let isUpdate = editingReference.id !== null;

//       console.log('Current editing reference:', editingReference);
//       console.log('Is Update?', isUpdate);

//       // Both ADD and UPDATE use the same structure
//       referenceData = {
//         employee_id: employeeId,
//         reference_name: editingReference.reference_name,
//         reference_mobile_number: editingReference.reference_mobile_number,
//         area: editingReference.area,
//         organization: editingReference.organization,
//         relationship_with_reference: editingReference.relationship_with_reference
//       };

//       if (isUpdate) {
//         // For UPDATE, add reference_id
//         referenceData.reference_id = editingReference.id;
//         console.log('Updating reference with ID:', editingReference.id);
//         console.log('Reference Update Data:', referenceData);
//       } else {
//         // For ADD, no reference_id needed
//         console.log('Adding new reference');
//         console.log('Reference Add Data:', referenceData);
//       }

//       const response = isUpdate
//         ? await EmployeeReferenceseAPI.update(referenceData)
//         : await EmployeeReferenceseAPI.add(referenceData);

//       if (response.success) {
//         if (isUpdate) {
//           setReferences(prev => prev.map((ref, idx) => 
//             idx === currentReferenceIndex ? editingReference : ref
//           ));
//         } else {
//           const newReference = {
//             ...editingReference,
//             id: response.result?.reference_id || response.result?.id
//           };
//           setReferences(prev => [...prev, newReference]);
//           setEditingReference(newReference);
//           setCurrentReferenceIndex(references.length);
//         }
        
//         return true;
//       } else {
//         alert(response.message || 'Failed to save reference details');
//         return false;
//       }
//     } catch (error) {
//       console.error('Error saving reference details:', error);
//       alert(error.message || 'Backend server is not responding');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePreviousReference = () => {
//     if (currentReferenceIndex > 0) {
//       const prevIndex = currentReferenceIndex - 1;
//       setCurrentReferenceIndex(prevIndex);
//       setEditingReference(references[prevIndex]);
//       setErrors({});
//     }
//   };

//   const handleNextReference = () => {
//     if (currentReferenceIndex < references.length - 1) {
//       const nextIndex = currentReferenceIndex + 1;
//       setCurrentReferenceIndex(nextIndex);
//       setEditingReference(references[nextIndex]);
//       setErrors({});
//     }
//   };

//   const handleAddNewReference = () => {
//     const newReference = {
//       id: null,
//       reference_name: '',
//       reference_mobile_number: '',
//       area: '',
//       organization: '',
//       relationship_with_reference: ''
//     };
//     setEditingReference(newReference);
//     setCurrentReferenceIndex(references.length);
//     setErrors({});
//   };

//   const handleDeleteReference = async () => {
//     if (!editingReference.id) {
//       alert('Cannot delete unsaved reference');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to delete this reference?')) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await EmployeeReferenceseAPI.delete(editingReference.id);

//       if (response.success) {
//         const updatedReferences = references.filter((_, idx) => idx !== currentReferenceIndex);
//         setReferences(updatedReferences);

//         if (updatedReferences.length > 0) {
//           const newIndex = Math.min(currentReferenceIndex, updatedReferences.length - 1);
//           setCurrentReferenceIndex(newIndex);
//           setEditingReference(updatedReferences[newIndex]);
//         } else {
//           handleAddNewReference();
//         }

//         alert('Reference deleted successfully!');
//       } else {
//         alert(response.message || 'Failed to delete reference');
//       }
//     } catch (error) {
//       console.error('Error deleting reference:', error);
//       alert('Failed to delete reference');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getReferenceDisplayInfo = () => {
//     const totalReferences = references.length;
//     const currentNumber = currentReferenceIndex + 1;
//     const isNewReference = !editingReference.id;
    
//     return {
//       totalReferences,
//       currentNumber,
//       isNewReference,
//       displayText: isNewReference 
//         ? `Adding New Reference (${currentNumber}/${totalReferences + 1})`
//         : `Reference ${currentNumber} of ${totalReferences}`
//     };
//   };

//   return (
//     <div className="reference-section p-6 bg-white rounded-2xl shadow-md">
//       {/* Header with navigation info */}
//       <div className="reference-header mb-6 border-b pb-3">
//         <h3 className="text-2xl font-semibold text-gray-800">{getReferenceDisplayInfo().displayText}</h3>
//         <p className="text-sm text-gray-600 mt-1">Add employee references (Optional - Skip if not applicable)</p>
//       </div>

//       {/* Form Fields */}
//       <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Reference Name
//           </label>
//           <input
//             type="text"
//             value={editingReference.reference_name}
//             onChange={(e) => handleInputChange('reference_name', e.target.value)}
//             placeholder="Enter reference name (e.g., Amit Kumar)"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.reference_name && <span className="text-red-500 text-sm">{errors.reference_name}</span>}
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Mobile Number
//           </label>
//           <input
//             type="text"
//             value={editingReference.reference_mobile_number}
//             onChange={(e) => handleInputChange('reference_mobile_number', e.target.value)}
//             placeholder="Enter 10-digit mobile number"
//             maxLength="10"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.reference_mobile_number && <span className="text-red-500 text-sm">{errors.reference_mobile_number}</span>}
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Area/Domain
//           </label>
//           <input
//             type="text"
//             value={editingReference.area}
//             onChange={(e) => handleInputChange('area', e.target.value)}
//             placeholder="Enter area/domain (e.g., Software Development)"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.area && <span className="text-red-500 text-sm">{errors.area}</span>}
//         </div>

//         <div className="form-group">
//           <label className="block text-gray-700 font-medium mb-1">
//             Organization
//           </label>
//           <input
//             type="text"
//             value={editingReference.organization}
//             onChange={(e) => handleInputChange('organization', e.target.value)}
//             placeholder="Enter organization name"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.organization && <span className="text-red-500 text-sm">{errors.organization}</span>}
//         </div>

//         <div className="form-group md:col-span-2">
//           <label className="block text-gray-700 font-medium mb-1">
//             Relationship with Reference
//           </label>
//           <input
//             type="text"
//             value={editingReference.relationship_with_reference}
//             onChange={(e) => handleInputChange('relationship_with_reference', e.target.value)}
//             placeholder="Enter relationship (e.g., Former Team Lead, Manager)"
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.relationship_with_reference && (
//             <span className="text-red-500 text-sm">{errors.relationship_with_reference}</span>
//           )}
//         </div>
//       </div>

//       {/* Navigation and Action Buttons */}
//       <div className="reference-actions flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
//         <div className="navigation-buttons flex gap-3">
//           <button
//             type="button"
//             onClick={handlePreviousReference}
//             disabled={currentReferenceIndex === 0 || isLoading}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             ← Previous
//           </button>

//           <button
//             type="button"
//             onClick={handleNextReference}
//             disabled={currentReferenceIndex >= references.length - 1 || isLoading}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             Next →
//           </button>
//         </div>

//         <div className="action-buttons flex flex-wrap gap-3">
//           <button
//             type="button"
//             onClick={handleAddNewReference}
//             disabled={isLoading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
//           >
//             + Add New Reference
//           </button>

//           <button
//             type="button"
//             onClick={saveCurrentReference}
//             disabled={isLoading}
//             className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : editingReference.id ? 'Update Reference' : 'Save Reference'}
//           </button>

//           <button
//             type="button"
//             onClick={handleSaveAndNext}
//             disabled={isLoading}
//             className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : 'Save & Next →'}
//           </button>

//           {editingReference.id && (
//             <button
//               type="button"
//               onClick={handleDeleteReference}
//               disabled={isLoading}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Info Display */}
//       <div className="reference-info mt-6 text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
//         <p className="font-medium">Total References: {references.length}</p>
//         {references.length > 0 && (
//           <p>Viewing: {currentReferenceIndex + 1} of {references.length}</p>
//         )}
//         <p className="text-xs text-gray-600 mt-2">
//           ℹ️ References are optional. You can skip this section by clicking "Save & Next" without adding any references.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReferences;
