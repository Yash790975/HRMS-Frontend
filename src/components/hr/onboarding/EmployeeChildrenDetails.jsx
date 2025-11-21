import { useState, useEffect } from 'react';
import { EmployeeChildrenDetailsAPI } from '../../../api/employeeChildrenDetails';
import { toast } from 'react-hot-toast';


const EmployeeChildrenDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [childrenList, setChildrenList] = useState([]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [editingChild, setEditingChild] = useState({
    child_id: null,
    child_number: '',
    child_name: '',
    child_dob: '',
    child_age: '',
    child_gender: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch children when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchChildren();
    }
  }, [employeeId]);

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      const response = await EmployeeChildrenDetailsAPI.getByEmployeeId(employeeId);
      if (response.success && Array.isArray(response.result)) {
        const list = response.result.map(child => ({
          child_id: child.child_id || child.id || null,
          child_number: child.child_number != null ? String(child.child_number) : '',
          child_name: child.child_name || '',
          child_dob: child.child_dob || '',
          child_age: child.child_age != null ? String(child.child_age) : '',
          child_gender: child.child_gender || '',
        }));
        setChildrenList(list);

        // If there is at least one child, set first as editing
        if (list.length > 0) {
          setEditingChild(list[0]);
          setCurrentChildIndex(0);
        } else {
          resetEditingChild();
        }
      } else {
        setChildrenList([]);
        resetEditingChild();
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildrenList([]);
      resetEditingChild();
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditingChild = () => {
    setEditingChild({
      child_id: null,
      child_number: '',
      child_name: '',
      child_dob: '',
      child_age: '',
      child_gender: '',
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditingChild(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateChild = () => {
    const newErrors = {};
    // if (!editingChild.child_number?.trim()) {
    //   newErrors.child_number = 'Child number is required';
    // }
    // if (!editingChild.child_name?.trim()) {
    //   newErrors.child_name = 'Child name is required';
    // }
    // if (!editingChild.child_dob) {
    //   newErrors.child_dob = 'Date of birth is required';
    // }
    // if (!editingChild.child_age || isNaN(editingChild.child_age)) {
    //   newErrors.child_age = 'Valid age is required';
    // }
    // if (!editingChild.child_gender) {
    //   newErrors.child_gender = 'Gender is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrentChild = async () => {
    if (!validateChild()) {
      return false;
    }
    if (!employeeId) {
      toast.error('Please save employee details first');
      return false;
    }

    try {
      setIsLoading(true);
      const isUpdate = editingChild.child_id !== null;

      // ✅ Handle date and gender properly - send null if empty, just like EmployeeFamilyDetails
      const payload = {
        employee_id: employeeId,
        child_number: Number(editingChild.child_number) || null,
        child_name: editingChild.child_name || null,
        child_dob: editingChild.child_dob || null, // ✅ Send null instead of empty string
        child_age: Number(editingChild.child_age) || null,
        child_gender: editingChild.child_gender || null, // ✅ Send null instead of empty string
      };

      if (isUpdate) {
        payload.child_id = editingChild.child_id;
      }

      const response = isUpdate
        ? await EmployeeChildrenDetailsAPI.update(payload)
        : await EmployeeChildrenDetailsAPI.add(payload);

      if (response.success) {
        const returned = response.result;
        const childFromServer = {
          child_id: returned.child_id || returned.id,
          child_number: returned.child_number != null ? String(returned.child_number) : '',
          child_name: returned.child_name,
          child_dob: returned.child_dob,
          child_age: returned.child_age != null ? String(returned.child_age) : '',
          child_gender: returned.child_gender,
        };

        if (isUpdate) {
          // update in list
          setChildrenList(prev =>
            prev.map((c, idx) =>
              idx === currentChildIndex ? childFromServer : c
            )
          );
        } else {
          // add new
          setChildrenList(prev => [...prev, childFromServer]);
          setCurrentChildIndex(childrenList.length); // new last index
        }

        setEditingChild(childFromServer);
        return true;
      } else {
        toast.error(response.message || 'Failed to save child details');
        return false;
      }
    } catch (error) {
      console.error('Error saving child:', error);
      toast.error(error.message || 'Server error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousChild = () => {
    if (currentChildIndex > 0) {
      const prevIndex = currentChildIndex - 1;
      setCurrentChildIndex(prevIndex);
      setEditingChild(childrenList[prevIndex]);
      setErrors({});
    }
  };

  const handleNextChild = () => {
    if (currentChildIndex < childrenList.length - 1) {
      const nextIndex = currentChildIndex + 1;
      setCurrentChildIndex(nextIndex);
      setEditingChild(childrenList[nextIndex]);
      setErrors({});
    }
  };

  const handleAddNewChild = () => {
    resetEditingChild();
    setCurrentChildIndex(childrenList.length);
  };

  const handleDeleteChild = async () => {
    if (!editingChild.child_id) {
      toast.error('Cannot delete unsaved child');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this child?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await EmployeeChildrenDetailsAPI.delete(editingChild.child_id);

      if (response.success) {
        const updated = childrenList.filter((_, idx) => idx !== currentChildIndex);
        setChildrenList(updated);

        if (updated.length > 0) {
          // go to next or previous
          const newIndex = Math.min(currentChildIndex, updated.length - 1);
          setCurrentChildIndex(newIndex);
          setEditingChild(updated[newIndex]);
        } else {
          handleAddNewChild();
        }

        toast.success('Child deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete child');
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Error deleting child');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndNextTab = async () => {
    const saved = await saveCurrentChild();
    if (saved) {
      onComplete?.();
      onNextTab?.();
    }
  };

  const getDisplayInfo = () => {
    const total = childrenList.length;
    const current = currentChildIndex + 1;
    const isNew = editingChild.child_id === null;
    return {
      total,
      current,
      isNew,
      text: isNew
        ? `Adding New Child (${current}/${total + 1})`
        : `Child ${current} of ${total}`,
    };
  };

  const { text: headerText } = getDisplayInfo();

  return (
    <div className="children-section p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">{headerText}</h3>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Child Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={editingChild.child_number}
            onChange={e => handleInputChange('child_number', e.target.value)}
            disabled={isLoading}
            min={1}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-60"
          />
          {errors.child_number && (
            <span className="text-red-500 text-sm">{errors.child_number}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Child Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingChild.child_name}
            onChange={e => handleInputChange('child_name', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-60"
          />
          {errors.child_name && (
            <span className="text-red-500 text-sm">{errors.child_name}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={editingChild.child_dob}
            onChange={e => handleInputChange('child_dob', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-60"
          />
          {errors.child_dob && (
            <span className="text-red-500 text-sm">{errors.child_dob}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={editingChild.child_age}
            onChange={e => handleInputChange('child_age', e.target.value)}
            disabled={isLoading}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-60"
          />
          {errors.child_age && (
            <span className="text-red-500 text-sm">{errors.child_age}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={editingChild.child_gender}
            onChange={e => handleInputChange('child_gender', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-60"
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          {errors.child_gender && (
            <span className="text-red-500 text-sm">{errors.child_gender}</span>
          )}
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex gap-3">
          <button
            onClick={handlePreviousChild}
            type="button"
            disabled={currentChildIndex === 0 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>
          <button
            onClick={handleNextChild}
            type="button"
            disabled={currentChildIndex >= childrenList.length - 1 || isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddNewChild}
            type="button"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + Add New Child
          </button>

          <button
            onClick={saveCurrentChild}
            type="button"
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading
              ? 'Saving...'
              : editingChild.child_id
              ? 'Update Child'
              : 'Save Child'}
          </button>

          <button
            onClick={handleSaveAndNextTab}
            type="button"
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {editingChild.child_id && (
            <button
              onClick={handleDeleteChild}
              type="button"
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-gray-700 text-sm">
        <p>Total Children: {childrenList.length}</p>
        {childrenList.length > 0 && (
          <p>
            Viewing: {currentChildIndex + 1} of {childrenList.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeChildrenDetails;