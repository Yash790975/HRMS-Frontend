// ============= FILE: src/components/hr/onboarding/EmployeePriorExperience.jsx =============
import { useState, useEffect } from 'react';
import { EmployeePriorExperienceAPI } from '../../../api/employeePriorExperience';

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
    onComplete?.(); // ✅ Mark this tab as completed
        // alert('Experience saved successfully!');
    onNextTab(); // move to next tab
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

    if (!editingExperience.post_held?.trim()) {
      newErrors.post_held = 'Post held is required';
    }
    if (!editingExperience.department_function?.trim()) {
      newErrors.department_function = 'Department/Function is required';
    }
    if (!editingExperience.company_name_size?.trim()) {
      newErrors.company_name_size = 'Company name & size is required';
    }
    if (!editingExperience.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!editingExperience.tenure_years_months?.toString().trim()) {
      newErrors.tenure_years_months = 'Tenure is required';
    } else {
      const tenure = parseFloat(editingExperience.tenure_years_months);
      if (isNaN(tenure) || tenure < 0) {
        newErrors.tenure_years_months = 'Tenure must be a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrentExperience = async () => {
    if (!validateExperienceDetails()) {
      return false;
    }

    if (!employeeId) {
      alert('Please save personal details first');
      return false;
    }

    try {
      setIsLoading(true);
      let experienceData;
      let isUpdate = editingExperience.id !== null;

      console.log('Current editing experience:', editingExperience);
      console.log('Is Update?', isUpdate);

      // Both ADD and UPDATE use the same structure
      experienceData = {
        employee_id: employeeId,
        post_held: editingExperience.post_held,
        department_function: editingExperience.department_function,
        company_name_size: editingExperience.company_name_size,
        city: editingExperience.city,
        tenure_years_months: parseFloat(editingExperience.tenure_years_months)
      };

      if (isUpdate) {
        // For UPDATE, add experience_id
        experienceData.experience_id = editingExperience.id;
        console.log('Updating experience with ID:', editingExperience.id);
        console.log('Experience Update Data:', experienceData);
      } else {
        // For ADD, no experience_id needed
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
        
        // alert(`Experience ${isUpdate ? 'updated' : 'added'} successfully!`);
        return true;
      } else {
        alert(response.message || 'Failed to save experience details');
        return false;
      }
    } catch (error) {
      console.error('Error saving experience details:', error);
      alert(error.message || 'Backend server is not responding');
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
      alert('Cannot delete unsaved experience');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

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

        alert('Experience deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete experience');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
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
  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm disabled:opacity-50"
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
