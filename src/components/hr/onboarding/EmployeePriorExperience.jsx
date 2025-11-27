import { useState, useEffect } from 'react';
import { EmployeePriorExperienceAPI } from '../../../api/employeePriorExperience';

// Modal Component
const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            {getIcon()}
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeePriorExperience = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingExperience, setEditingExperience] = useState({
    id: null,
    post_held: '',
    department_function: '',
    company_name_size: '', 
    city: '',
    tenure_years_months: ''
  });

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Show modal helper
  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'info'
    });
  };

  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Fetch experiences when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchExperiencesData();
    }
  }, [employeeId]);

  const fetchExperiencesData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for experiences fetch');
      return;
    }
    
    try {
      console.log('Fetching experiences data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeePriorExperienceAPI.getByEmployeeId(employeeId);

      console.log('Experiences API Response:', response);

      if (response.success && response.result && Array.isArray(response.result)) {
        const experiencesArray = response.result.map(exp => ({
          id: exp.experience_id || exp.id || null,
          post_held: exp.post_held || '',
          department_function: exp.department_function || '',
          company_name_size: exp.company_name_size || '',
          city: exp.city || '',
          tenure_years_months: exp.tenure_years_months || ''
        }));
        
        console.log('Setting experiences array:', experiencesArray);
        setExperiences(experiencesArray);

        if (experiencesArray.length > 0) {
          setEditingExperience(experiencesArray[0]);
          setCurrentExperienceIndex(0);
        }
      } else {
        console.log('No experiences data found for employee');
        setExperiences([]);
        resetEditingExperience();
      }
    } catch (error) {
      console.error('Error fetching experiences data:', error);
      setExperiences([]);
      resetEditingExperience();
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditingExperience = () => {
    setEditingExperience({
      id: null,
      post_held: '',
      department_function: '',
      company_name_size: '',
      city: '',
      tenure_years_months: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await saveCurrentExperience();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleInputChange = (field, value) => {
    setEditingExperience(prev => ({
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

  const validateExperienceDetails = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrentExperience = async () => {
    if (!validateExperienceDetails()) {
      return false;
    }

    if (!employeeId) {
      showModal('Error', 'Please save personal details first', 'error');
      return false;
    }

    try {
      setIsLoading(true);
      let experienceData;
      let isUpdate = editingExperience.id !== null;

      console.log('Current editing experience:', editingExperience);
      console.log('Is Update?', isUpdate);

      experienceData = {
        employee_id: employeeId,
        post_held: editingExperience.post_held,
        department_function: editingExperience.department_function,
        company_name_size: editingExperience.company_name_size,
        city: editingExperience.city,
        tenure_years_months: parseFloat(editingExperience.tenure_years_months)
      };

      if (isUpdate) {
        experienceData.experience_id = editingExperience.id;
        console.log('Updating experience with ID:', editingExperience.id);
        console.log('Experience Update Data:', experienceData);
      } else {
        console.log('Adding new experience');
        console.log('Experience Add Data:', experienceData);
      }

      const response = isUpdate
        ? await EmployeePriorExperienceAPI.update(experienceData)
        : await EmployeePriorExperienceAPI.add(experienceData);

      if (response.success) {
        if (isUpdate) {
          setExperiences(prev => prev.map((exp, idx) => 
            idx === currentExperienceIndex ? editingExperience : exp
          ));
        } else {
          const newExperience = {
            ...editingExperience,
            id: response.result?.experience_id || response.result?.id
          };
          setExperiences(prev => [...prev, newExperience]);
          setEditingExperience(newExperience);
          setCurrentExperienceIndex(experiences.length);
        }
        
        showModal(
          'Success',
          `Experience ${isUpdate ? 'updated' : 'added'} successfully!`,
          'success'
        );
        return true;
      } else {
        showModal(
          'Error',
          response.message || 'Failed to save experience details',
          'error'
        );
        return false;
      }
    } catch (error) {
      console.error('Error saving experience details:', error);
      showModal(
        'Error',
        error.message || 'Backend server is not responding',
        'error'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousExperience = () => {
    if (currentExperienceIndex > 0) {
      const prevIndex = currentExperienceIndex - 1;
      setCurrentExperienceIndex(prevIndex);
      setEditingExperience(experiences[prevIndex]);
      setErrors({});
    }
  };

  const handleNextExperience = () => {
    if (currentExperienceIndex < experiences.length - 1) {
      const nextIndex = currentExperienceIndex + 1;
      setCurrentExperienceIndex(nextIndex);
      setEditingExperience(experiences[nextIndex]);
      setErrors({});
    }
  };

  const handleAddNewExperience = () => {
    const newExperience = {
      id: null,
      post_held: '',
      department_function: '',
      company_name_size: '',
      city: '',
      tenure_years_months: ''
    };
    setEditingExperience(newExperience);
    setCurrentExperienceIndex(experiences.length);
    setErrors({});
  };

  const handleDeleteExperience = async () => {
    if (!editingExperience.id) {
      showModal('Warning', 'Cannot delete unsaved experience', 'warning');
      return;
    }

    showConfirmModal(
      'Confirm Delete',
      'Are you sure you want to delete this experience? This action cannot be undone.',
      async () => {
        closeConfirmModal();
        try {
          setIsLoading(true);
          const response = await EmployeePriorExperienceAPI.delete(editingExperience.id);

          if (response.success) {
            const updatedExperiences = experiences.filter((_, idx) => idx !== currentExperienceIndex);
            setExperiences(updatedExperiences);

            if (updatedExperiences.length > 0) {
              const newIndex = Math.min(currentExperienceIndex, updatedExperiences.length - 1);
              setCurrentExperienceIndex(newIndex);
              setEditingExperience(updatedExperiences[newIndex]);
            } else {
              handleAddNewExperience();
            }

            showModal('Success', 'Experience deleted successfully!', 'success');
          } else {
            showModal('Error', response.message || 'Failed to delete experience', 'error');
          }
        } catch (error) {
          console.error('Error deleting experience:', error);
          showModal('Error', 'Failed to delete experience', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const getExperienceDisplayInfo = () => {
    const totalExperiences = experiences.length;
    const currentNumber = currentExperienceIndex + 1;
    const isNewExperience = !editingExperience.id;
    
    return {
      totalExperiences,
      currentNumber,
      isNewExperience,
      displayText: isNewExperience 
        ? `Adding New Experience (${currentNumber}/${totalExperiences + 1})`
        : `Experience ${currentNumber} of ${totalExperiences}`
    };
  };

  return (
    <div className="experience-section p-6 bg-white rounded-2xl shadow-md">
      {/* Modals */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Header with navigation info */}
      <div className="experience-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">{getExperienceDisplayInfo().displayText}</h3>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Post Held <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingExperience.post_held}
            onChange={(e) => handleInputChange('post_held', e.target.value)}
            placeholder="Enter post held (e.g., Senior Software Engineer)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.post_held && <span className="text-red-500 text-sm">{errors.post_held}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Department/Function <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingExperience.department_function}
            onChange={(e) => handleInputChange('department_function', e.target.value)}
            placeholder="Enter department/function (e.g., Product Development)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.department_function && <span className="text-red-500 text-sm">{errors.department_function}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Company Name & Size <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingExperience.company_name_size}
            onChange={(e) => handleInputChange('company_name_size', e.target.value)}
            placeholder="Enter company name and size (e.g., TechCorp India - Medium)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.company_name_size && <span className="text-red-500 text-sm">{errors.company_name_size}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingExperience.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city (e.g., Bangalore)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Tenure (Years/Months) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={editingExperience.tenure_years_months}
            onChange={(e) => handleInputChange('tenure_years_months', e.target.value)}
            placeholder="Enter tenure (e.g., 4.0 for 4 years)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.tenure_years_months && (
            <span className="text-red-500 text-sm">{errors.tenure_years_months}</span>
          )}
          <small className="text-gray-500 text-xs block mt-1">
            Enter in decimal format (e.g., 2.5 for 2 years 6 months)
          </small>
        </div>
      </div>

      {/* Navigation and Action Buttons */}
      <div className="experience-actions flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="navigation-buttons flex gap-3">
          <button
            type="button"
            onClick={handlePreviousExperience}
            disabled={currentExperienceIndex === 0 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={handleNextExperience}
            disabled={currentExperienceIndex >= experiences.length - 1 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>

        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAddNewExperience}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + Add New Experience
          </button>

          <button
            type="button"
            onClick={saveCurrentExperience}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingExperience.id ? 'Update Experience' : 'Save Experience'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {editingExperience.id && (
            <button
              type="button"
              onClick={handleDeleteExperience}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="experience-info mt-6 text-gray-700 text-sm">
        <p>Total Experiences: {experiences.length}</p>
        {experiences.length > 0 && (
          <p>Viewing: {currentExperienceIndex + 1} of {experiences.length}</p>
        )}
      </div>
    </div>
  );
};

export default EmployeePriorExperience;
