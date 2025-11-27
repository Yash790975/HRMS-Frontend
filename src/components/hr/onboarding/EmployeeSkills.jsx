import { useState, useEffect } from 'react';
import { EmployeeSkillsAPI } from '../../../api/employeeSkills';

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

const EmployeeSkills = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingSkill, setEditingSkill] = useState({
    id: null,
    skill_area: '',
    skills_acquired: '',
    certification_grade: '',
    project_summary: ''      
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

  // Fetch skills when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchSkillsData();
    }
  }, [employeeId]);

  const fetchSkillsData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for skills fetch');
      return;
    }
    
    try {
      console.log('Fetching skills data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeSkillsAPI.getByEmployeeId(employeeId);

      console.log('Skills API Response:', response);

      if (response.success && response.result && Array.isArray(response.result)) {
        const skillsArray = response.result.map(skill => ({
          id: skill.skill_id || skill.id || null,
          skill_area: skill.skill_area || '',
          skills_acquired: skill.skills_acquired || '',
          certification_grade: skill.certification_grade || '',
          project_summary: skill.project_summary || ''
        }));
        
        console.log('Setting skills array:', skillsArray);
        setSkills(skillsArray);

        if (skillsArray.length > 0) {
          setEditingSkill(skillsArray[0]);
          setCurrentSkillIndex(0);
        }
      } else {
        console.log('No skills data found for employee');
        setSkills([]);
        resetEditingSkill();
      }
    } catch (error) {
      console.error('Error fetching skills data:', error);
      setSkills([]);
      resetEditingSkill();
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditingSkill = () => {
    setEditingSkill({
      id: null,
      skill_area: '',
      skills_acquired: '',
      certification_grade: '',
      project_summary: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await saveCurrentSkill();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleInputChange = (field, value) => {
    setEditingSkill(prev => ({
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

  const validateSkillDetails = () => {
    const newErrors = {};

    if (!editingSkill.skill_area?.trim()) {
      newErrors.skill_area = 'Skill area is required';
    }

    if (!editingSkill.skills_acquired?.trim()) {
      newErrors.skills_acquired = 'Skills acquired is required';
    }

    if (!editingSkill.certification_grade?.trim()) {
      newErrors.certification_grade = 'Certification/Grade is required';
    }

    if (!editingSkill.project_summary?.trim()) {
      newErrors.project_summary = 'Project summary is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrentSkill = async () => {
    if (!validateSkillDetails()) {
      return false;
    }

    if (!employeeId) {
      showModal('Error', 'Please save personal details first', 'error');
      return false;
    }

    try {
      setIsLoading(true);
      let skillData;
      let isUpdate = editingSkill.id !== null;

      console.log('Current editing skill:', editingSkill);
      console.log('Is Update?', isUpdate);

      skillData = {
        employee_id: employeeId,
        skill_area: editingSkill.skill_area,
        skills_acquired: editingSkill.skills_acquired,
        certification_grade: editingSkill.certification_grade,
        project_summary: editingSkill.project_summary
      };

      if (isUpdate) {
        skillData.skill_id = editingSkill.id;
        console.log('Updating skill with ID:', editingSkill.id);
        console.log('Skill Update Data:', skillData);
      } else {
        console.log('Adding new skill');
        console.log('Skill Add Data:', skillData);
      }

      const response = isUpdate
        ? await EmployeeSkillsAPI.update(skillData)
        : await EmployeeSkillsAPI.add(skillData);

      if (response.success) {
        if (isUpdate) {
          setSkills(prev => prev.map((skill, idx) => 
            idx === currentSkillIndex ? editingSkill : skill
          ));
        } else {
          const newSkill = {
            ...editingSkill,
            id: response.result?.skill_id || response.result?.id
          };
          setSkills(prev => [...prev, newSkill]);
          setEditingSkill(newSkill);
          setCurrentSkillIndex(skills.length);
        }
        
        showModal(
          'Success', 
          `Skill ${isUpdate ? 'updated' : 'added'} successfully!`, 
          'success'
        );
        return true;
      } else {
        showModal(
          'Error', 
          response.message || 'Failed to save skill details', 
          'error'
        );
        return false;
      }
    } catch (error) {
      console.error('Error saving skill details:', error);
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

  const handlePreviousSkill = () => {
    if (currentSkillIndex > 0) {
      const prevIndex = currentSkillIndex - 1;
      setCurrentSkillIndex(prevIndex);
      setEditingSkill(skills[prevIndex]);
      setErrors({});
    }
  };

  const handleNextSkill = () => {
    if (currentSkillIndex < skills.length - 1) {
      const nextIndex = currentSkillIndex + 1;
      setCurrentSkillIndex(nextIndex);
      setEditingSkill(skills[nextIndex]);
      setErrors({});
    }
  };

  const handleAddNewSkill = () => {
    const newSkill = {
      id: null,
      skill_area: '',
      skills_acquired: '',
      certification_grade: '',
      project_summary: ''
    };
    setEditingSkill(newSkill);
    setCurrentSkillIndex(skills.length);
    setErrors({});
  };

  const handleDeleteSkill = async () => {
    if (!editingSkill.id) {
      showModal('Warning', 'Cannot delete unsaved skill', 'warning');
      return;
    }

    showConfirmModal(
      'Confirm Delete',
      'Are you sure you want to delete this skill? This action cannot be undone.',
      async () => {
        closeConfirmModal();
        try {
          setIsLoading(true);
          const response = await EmployeeSkillsAPI.delete(editingSkill.id);

          if (response.success) {
            const updatedSkills = skills.filter((_, idx) => idx !== currentSkillIndex);
            setSkills(updatedSkills);

            if (updatedSkills.length > 0) {
              const newIndex = Math.min(currentSkillIndex, updatedSkills.length - 1);
              setCurrentSkillIndex(newIndex);
              setEditingSkill(updatedSkills[newIndex]);
            } else {
              handleAddNewSkill();
            }

            showModal('Success', 'Skill deleted successfully!', 'success');
          } else {
            showModal('Error', response.message || 'Failed to delete skill', 'error');
          }
        } catch (error) {
          console.error('Error deleting skill:', error);
          showModal('Error', 'Failed to delete skill', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const getSkillDisplayInfo = () => {
    const totalSkills = skills.length;
    const currentNumber = currentSkillIndex + 1;
    const isNewSkill = !editingSkill.id;
    
    return {
      totalSkills,
      currentNumber,
      isNewSkill,
      displayText: isNewSkill 
        ? `Adding New Skill (${currentNumber}/${totalSkills + 1})`
        : `Skill ${currentNumber} of ${totalSkills}`
    };
  };

  return (
    <div className="skill-section p-6 bg-white rounded-2xl shadow-md">
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
      <div className="skill-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">{getSkillDisplayInfo().displayText}</h3>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Skill Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingSkill.skill_area}
            onChange={(e) => handleInputChange('skill_area', e.target.value)}
            placeholder="Enter skill area (e.g., Full Stack Development)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.skill_area && <span className="text-red-500 text-sm">{errors.skill_area}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Skills Acquired <span className="text-red-500">*</span>
          </label>
          <textarea
            value={editingSkill.skills_acquired}
            onChange={(e) => handleInputChange('skills_acquired', e.target.value)}
            placeholder="Enter skills acquired (e.g., React, Node.js, MongoDB, Express.js)"
            disabled={isLoading}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.skills_acquired && <span className="text-red-500 text-sm">{errors.skills_acquired}</span>}
          <small className="text-gray-500 text-xs block mt-1">
            List all relevant skills separated by commas
          </small>
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Certification/Grade <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingSkill.certification_grade}
            onChange={(e) => handleInputChange('certification_grade', e.target.value)}
            placeholder="Enter certification or proficiency grade (e.g., Expert, Advanced, Intermediate)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.certification_grade && <span className="text-red-500 text-sm">{errors.certification_grade}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Project Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            value={editingSkill.project_summary}
            onChange={(e) => handleInputChange('project_summary', e.target.value)}
            placeholder="Provide a brief summary of projects where you utilized these skills"
            disabled={isLoading}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.project_summary && (
            <span className="text-red-500 text-sm">{errors.project_summary}</span>
          )}
          <small className="text-gray-500 text-xs block mt-1">
            Describe relevant projects and your contributions
          </small>
        </div>
      </div>

      {/* Navigation and Action Buttons */}
      <div className="skill-actions flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="navigation-buttons flex gap-3">
          <button
            type="button"
            onClick={handlePreviousSkill}
            disabled={currentSkillIndex === 0 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={handleNextSkill}
            disabled={currentSkillIndex >= skills.length - 1 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>

        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAddNewSkill}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + Add New Skill
          </button>

          <button
            type="button"
            onClick={saveCurrentSkill}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingSkill.id ? 'Update Skill' : 'Save Skill'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {editingSkill.id && (
            <button
              type="button"
              onClick={handleDeleteSkill}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete 
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="skill-info mt-6 text-gray-700 text-sm">
        <p>Total Skills: {skills.length}</p>
        {skills.length > 0 && (
          <p>Viewing: {currentSkillIndex + 1} of {skills.length}</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSkills;


