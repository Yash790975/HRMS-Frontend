import { useState, useEffect } from 'react';
import { EmployeeBankDetailsAPI } from '../../../api/employeeBankDetails';
import Modal from './AlertModal';

const EmployeeBankDetails = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [errors, setErrors] = useState({});
  const [bankDetails, setBankDetails] = useState({
    bank_id: null,
    account_holder_name: '',
    registered_mobile_number: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    account_type: ''
  });

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false
  });

  const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
      onConfirm: null,
      showCancel: false
    });
  };

  // Fetch bank details when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchBankDetailsData();
    }
  }, [employeeId]);

  const fetchBankDetailsData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for bank details fetch');
      return;
    }
    
    try {
      console.log('Fetching bank details data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeBankDetailsAPI.getByEmployeeId(employeeId);

      console.log('Bank Details API Response:', response);

      if (response.success && response.result) {
        const bankData = {
          bank_id: response.result.bank_id || response.result.id || null,
          account_holder_name: response.result.account_holder_name || '',
          registered_mobile_number: response.result.registered_mobile_number || '',
          account_number: response.result.account_number || '',
          ifsc_code: response.result.ifsc_code || '',
          bank_name: response.result.bank_name || '',
          branch_name: response.result.branch_name || '',
          account_type: response.result.account_type || ''
        };
        
        console.log('Setting bank details:', bankData);
        setBankDetails(bankData);
      } else {
        console.log('No bank details data found for employee');
        resetBankDetails();
      }
    } catch (error) {
      console.error('Error fetching bank details data:', error);
      resetBankDetails();
    } finally {
      setIsLoading(false);
    }
  };

  const resetBankDetails = () => {
    setBankDetails({
      bank_id: null,
      account_holder_name: '',
      registered_mobile_number: '',
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      branch_name: '',
      account_type: ''
    });
  };

  const handleSaveAndNext = async () => {
    const saved = await saveBankDetails();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'ifsc_code') {
      value = value.toUpperCase();
    }

    setBankDetails(prev => ({
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

  const validateBankDetails = () => {
    const newErrors = {};

    if (!bankDetails.account_holder_name?.trim()) {
      newErrors.account_holder_name = 'Account holder name is required';
    }

    if (!bankDetails.registered_mobile_number?.trim()) {
      newErrors.registered_mobile_number = 'Registered mobile number is required';
    } else {
      const mobilePattern = /^[0-9]{10}$/;
      if (!mobilePattern.test(bankDetails.registered_mobile_number.trim())) {
        newErrors.registered_mobile_number = 'Mobile number must be 10 digits';
      }
    }

    if (!bankDetails.account_number?.trim()) {
      newErrors.account_number = 'Account number is required';
    } else if (!/^[0-9]{9,18}$/.test(bankDetails.account_number.trim())) {
      newErrors.account_number = 'Account number must be 9-18 digits';
    }

    if (!bankDetails.ifsc_code?.trim()) {
      newErrors.ifsc_code = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc_code.trim())) {
      newErrors.ifsc_code = 'Invalid IFSC code format (e.g., SBIN0001234)';
    }

    if (!bankDetails.bank_name?.trim()) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!bankDetails.branch_name?.trim()) {
      newErrors.branch_name = 'Branch name is required';
    }

    if (!bankDetails.account_type) {
      newErrors.account_type = 'Account type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveBankDetails = async () => {
    if (!validateBankDetails()) {
      return false;
    }

    if (!employeeId) {
      showModal('Error', 'Please save personal details first', 'error');
      return false;
    }

    try {
      setIsLoading(true);
      let bankData;
      let isUpdate = bankDetails.bank_id !== null;

      console.log('Current bank details:', bankDetails);
      console.log('Is Update?', isUpdate);

      bankData = {
        employee_id: employeeId,
        account_holder_name: bankDetails.account_holder_name,
        registered_mobile_number: bankDetails.registered_mobile_number,
        account_number: bankDetails.account_number,
        ifsc_code: bankDetails.ifsc_code,
        bank_name: bankDetails.bank_name,
        branch_name: bankDetails.branch_name,
        account_type: bankDetails.account_type
      };

      if (isUpdate) {
        bankData.bank_id = bankDetails.bank_id;
        console.log('Updating bank details with ID:', bankDetails.bank_id);
        console.log('Bank Details Update Data:', bankData);
      } else {
        console.log('Adding new bank details');
        console.log('Bank Details Add Data:', bankData);
      }

      const response = isUpdate
        ? await EmployeeBankDetailsAPI.update(bankData)
        : await EmployeeBankDetailsAPI.add(bankData);

      if (response.success) {
        if (!isUpdate) {
          setBankDetails(prev => ({
            ...prev,
            bank_id: response.result?.bank_id || response.result?.id
          }));
        }
        
        return true;
      } else {
        showModal('Error', response.message || 'Failed to save bank details', 'error');
        return false;
      }
    // } catch (error) {   
    //   console.error('Error saving bank details:', error);
    //   showModal('Error', error.message || 'Backend server is not responding', 'error');
    //   return false;
    // }
    } catch (error) {
      const msg = error.message || "Backend server is not responding";
      showModal("Error", msg.includes("already exists")
        ? "This Account number already exists. Please use a different number."
        : msg
      );  
      return false;
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBankDetails = async () => {
    if (!bankDetails.bank_id) {
      showModal('Error', 'Cannot delete unsaved bank details', 'error');
      return;
    }

    showModal(
      'Confirm Delete',
      'Are you sure you want to delete these bank details?',
      'warning',
      async () => {
        closeModal();
        try {
          setIsLoading(true);
          const response = await EmployeeBankDetailsAPI.delete(bankDetails.bank_id);

          if (response.success) {
            resetBankDetails();
            showModal('Success', 'Bank details deleted successfully!', 'success');
          } else {
            showModal('Error', response.message || 'Failed to delete bank details', 'error');
          }
        } catch (error) {
          console.error('Error deleting bank details:', error);
          showModal('Error', 'Failed to delete bank details', 'error');
        } finally {
          setIsLoading(false);
        }
      },
      true
    );
  };

  return (
    <div className="bank-details-section p-6 bg-white rounded-2xl shadow-md">
      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
      />

      {/* Header */}
      <div className="bank-header mb-6 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">Bank Account Details</h3>
        <p className="text-sm text-gray-600 mt-1">Enter banking information for salary payments</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankDetails.account_holder_name}
            onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
            placeholder="Enter account holder name as per bank records"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.account_holder_name && <span className="text-red-500 text-sm">{errors.account_holder_name}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Registered Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankDetails.registered_mobile_number}
            onChange={(e) => handleInputChange('registered_mobile_number', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.registered_mobile_number && <span className="text-red-500 text-sm">{errors.registered_mobile_number}</span>}
          <small className="text-gray-500 text-xs block mt-1">
            Mobile number registered with bank account
          </small>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankDetails.account_number}
            onChange={(e) => handleInputChange('account_number', e.target.value)}
            placeholder="Enter bank account number"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.account_number && <span className="text-red-500 text-sm">{errors.account_number}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankDetails.ifsc_code}
            onChange={(e) => handleInputChange('ifsc_code', e.target.value)}
            placeholder="Enter IFSC code (e.g., SBIN0001234)"
            maxLength="11"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 uppercase"
          />
          {errors.ifsc_code && <span className="text-red-500 text-sm">{errors.ifsc_code}</span>}
          <small className="text-gray-500 text-xs block mt-1">
            11-character code (e.g., SBIN0001234)
          </small>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Account Type <span className="text-red-500">*</span>
          </label>
          <select
            value={bankDetails.account_type}
            onChange={(e) => handleInputChange('account_type', e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            <option value="">Select Account Type</option>
            <option value="SAVINGS">Savings Account</option>
            <option value="CURRENT">Current Account</option>
            <option value="SALARY">Salary Account</option>
          </select>
          {errors.account_type && <span className="text-red-500 text-sm">{errors.account_type}</span>}
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-medium mb-1">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankDetails.bank_name}
            onChange={(e) => handleInputChange('bank_name', e.target.value)}
            placeholder="Enter bank name (e.g., State Bank of India)"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.bank_name && <span className="text-red-500 text-sm">{errors.bank_name}</span>}
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Branch Name <span className="text-red-500">*</span>
          </label> 
          <input
            type="text" 
            value={bankDetails.branch_name}
            onChange={(e) => handleInputChange('branch_name', e.target.value)}
            placeholder="Enter branch name and location"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.branch_name && <span className="text-red-500 text-sm">{errors.branch_name}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bank-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveBankDetails}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : bankDetails.bank_id ? 'Update Bank Details' : 'Save Bank Details'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Next →'}
          </button>

          {bankDetails.bank_id && (
            <button
              type="button"
              onClick={handleDeleteBankDetails}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="bank-info mt-6 text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Status: {bankDetails.bank_id ? 'Bank details saved' : 'No bank details saved yet'}</p>
        <p className="text-xs text-gray-600">
          ⚠️ Please ensure all banking information is accurate. This will be used for salary payments.
        </p>
      </div>
    </div>
  );
};

export default EmployeeBankDetails;


