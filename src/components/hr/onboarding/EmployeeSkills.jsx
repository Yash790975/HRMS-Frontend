import { useState, useEffect } from 'react';
import { EmployeeSkillsAPI } from '../../../api/employeeSkills';

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
      onComplete?.(); // ✅ Mark this tab as completed
      // alert('Skills saved successfully!');
      onNextTab(); // move to next tab
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
      alert('Please save personal details first');
      return false;
    }

    try {
      setIsLoading(true);
      let skillData;
      let isUpdate = editingSkill.id !== null;

      console.log('Current editing skill:', editingSkill);
      console.log('Is Update?', isUpdate);

      // Both ADD and UPDATE use the same structure
      skillData = {
        employee_id: employeeId,
        skill_area: editingSkill.skill_area,
        skills_acquired: editingSkill.skills_acquired,
        certification_grade: editingSkill.certification_grade,
        project_summary: editingSkill.project_summary
      };

      if (isUpdate) {
        // For UPDATE, add skill_id
        skillData.skill_id = editingSkill.id;
        console.log('Updating skill with ID:', editingSkill.id);
        console.log('Skill Update Data:', skillData);
      } else {
        // For ADD, no skill_id needed
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
        
        // alert(`Skill ${isUpdate ? 'updated' : 'added'} successfully!`);
        return true;
      } else {
        alert(response.message || 'Failed to save skill details');
        return false;
      }
    } catch (error) {
      console.error('Error saving skill details:', error);
      alert(error.message || 'Backend server is not responding');
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
      alert('Cannot delete unsaved skill');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

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

        alert('Skill deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    } finally {
      setIsLoading(false);
    }
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
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm disabled:opacity-50"
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