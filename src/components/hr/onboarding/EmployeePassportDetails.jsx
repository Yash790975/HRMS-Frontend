import { useState, useEffect } from 'react';
import { EmployeePassportDetailsAPI } from '../../../api/employeePassportDetails';

/* ------------------------------
   CUSTOM REUSABLE MODAL COMPONENT
--------------------------------*/
const Modal = ({ open, title, message, onClose, onConfirm, showCancel = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm || onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};


const EmployeePassportDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  
  /* ------------------------------
     MODAL STATE
  ------------------------------*/
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  const showModal = (title, message, onConfirm = null, showCancel = false) => {
    setModal({
      open: true,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeModal = () => {
    setModal({ open: false, title: '', message: '', onConfirm: null, showCancel: false });
  };


  /* ------------------------------ */

  const [errors, setErrors] = useState({});
  const [passportDetails, setPassportDetails] = useState({
    id: null,
    passport_number: '',
    place_of_issue: '',
    date_of_issue: '',
    date_of_expiry: ''
  });


  useEffect(() => {
    if (employeeId) {
      fetchPassportData();
    }
  }, [employeeId]);


  const fetchPassportData = async () => {
    if (!employeeId) return;

    try {
      setIsLoading(true);
      const response = await EmployeePassportDetailsAPI.getByEmployeeId(employeeId);

      if (response.success && response.result) {
        const passportData = {
          id: response.result.passport_id || response.result.id || null,
          passport_number: response.result.passport_number || '',
          place_of_issue: response.result.place_of_issue || '',
          date_of_issue: response.result.date_of_issue || '',
          date_of_expiry: response.result.date_of_expiry || ''
        };

        setPassportDetails(passportData);
      } else {
        resetPassportDetails();
      }
    } catch (error) {
      console.error('Error fetching passport:', error);
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
      onComplete?.();
      onNextTab();
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


  const sanitizeValue = (value) => {
    return value && value.trim() !== '' ? value : null;
  };

  const sanitizePassportData = (data) => ({
    ...data,
    passport_number: sanitizeValue(data.passport_number),
    place_of_issue: sanitizeValue(data.place_of_issue),
    date_of_issue: sanitizeValue(data.date_of_issue),
    date_of_expiry: sanitizeValue(data.date_of_expiry)
  });


  const validatePassportDetails = () => {
    const newErrors = {};

    const hasAnyData =
      passportDetails.passport_number?.trim() ||
      passportDetails.place_of_issue?.trim() ||
      passportDetails.date_of_issue ||
      passportDetails.date_of_expiry;

    if (hasAnyData) {
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
    if (!validatePassportDetails()) return false;

    if (!employeeId) {
      showModal("Employee ID Missing", "Please save personal details first.");
      return false;
    }

    const hasAnyData =
      passportDetails.passport_number?.trim() ||
      passportDetails.place_of_issue?.trim() ||
      passportDetails.date_of_issue ||
      passportDetails.date_of_expiry;

    if (!hasAnyData) return true;

    try {
      setIsLoading(true);
      const isUpdate = passportDetails.id !== null;

      let passportData = sanitizePassportData({
        employee_id: employeeId,
        passport_number: passportDetails.passport_number,
        place_of_issue: passportDetails.place_of_issue,
        date_of_issue: passportDetails.date_of_issue,
        date_of_expiry: passportDetails.date_of_expiry
      });

      if (isUpdate) {
        passportData.passport_id = passportDetails.id;
      }

      const response = isUpdate
        ? await EmployeePassportDetailsAPI.update(passportData)
        : await EmployeePassportDetailsAPI.add(passportData);

      if (response.success) {
        if (!isUpdate) {
          setPassportDetails(prev => ({
            ...prev,
            id: response.result?.passport_id || response.result?.id
          }));
        }

        showModal(
          "Success",
          isUpdate ? "Passport details updated successfully!" : "Passport details saved!"
        );

        return true;
      } else {
        showModal("Error", response.message || "Failed to save passport details");
        return false;
      }
    } catch (error) {
      const msg = error.message || "Backend server is not responding";
      showModal("Error", msg.includes("already exists")
        ? "This passport number already exists. Please use a different number."
        : msg
      );  
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeletePassportDetails = async () => {
    if (!passportDetails.id) {
      showModal("Delete Error", "Cannot delete unsaved passport details.");
      return;
    }

    // Replace confirm with modal
    showModal(
      "Confirm Delete",
      "Are you sure you want to delete these passport details?",
      async () => {
        closeModal();
        try {
          setIsLoading(true);
          const response = await EmployeePassportDetailsAPI.delete(passportDetails.id);

          if (response.success) {
            resetPassportDetails();
            showModal("Deleted", "Passport details deleted successfully!");
          } else {
            showModal("Error", response.message || "Failed to delete passport details");
          }
        } catch (error) {
          showModal("Error", "Failed to delete passport details");
        } finally {
          setIsLoading(false);
        }
      },
      true // show cancel button
    );
  };


  return (
    <div className="passport-details-section p-6 bg-white rounded-2xl shadow-md">

      {/* MODAL RENDER */}
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
      />

      {/* Header */}
      <div className="passport-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">Passport Details</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter employee passport information (Optional - Skip if not applicable)
        </p>
      </div>

      {/* Form */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Passport Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Passport Number</label>
          <input
            type="text"
            value={passportDetails.passport_number}
            onChange={(e) => handleInputChange('passport_number', e.target.value.toUpperCase())}
            placeholder="Z1234567"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.passport_number && (
            <span className="text-red-500 text-sm">{errors.passport_number}</span>
          )}
        </div>

        {/* Place of Issue */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Place of Issue</label>
          <input
            type="text"
            value={passportDetails.place_of_issue}
            onChange={(e) => handleInputChange('place_of_issue', e.target.value)}
            placeholder="New Delhi"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.place_of_issue && (
            <span className="text-red-500 text-sm">{errors.place_of_issue}</span>
          )}
        </div>

        {/* Date of Issue */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Issue</label>
          <input
            type="date"
            value={passportDetails.date_of_issue}
            onChange={(e) => handleInputChange('date_of_issue', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.date_of_issue && (
            <span className="text-red-500 text-sm">{errors.date_of_issue}</span>
          )}
        </div>

        {/* Date of Expiry */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Expiry</label>
          <input
            type="date"
            value={passportDetails.date_of_expiry}
            onChange={(e) => handleInputChange('date_of_expiry', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.date_of_expiry && (
            <span className="text-red-500 text-sm">{errors.date_of_expiry}</span>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={savePassportDetails}
          disabled={isLoading}
          className="px-5 py-2 bg-green-600 text-white rounded-lg"
        >
          {isLoading ? 'Saving...' : passportDetails.id ? 'Update Passport Details' : 'Save Passport Details'}
        </button>

        <button
          type="button"
          onClick={handleSaveAndNext}
          disabled={isLoading}
          className="px-5 py-2 bg-orange-600 text-white rounded-lg"
        >
          {isLoading ? 'Saving...' : 'Save & Next →'}
        </button>

        {passportDetails.id && (
          <button
            type="button"
            onClick={handleDeletePassportDetails}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        )}
      </div>

      {/* Info */}
      <p className="mt-6 text-gray-700 text-sm">
        Status: {passportDetails.id ? 'Passport details saved' : 'No passport details saved yet (optional)'}
      </p>

    </div>
  );
};

export default EmployeePassportDetails;












