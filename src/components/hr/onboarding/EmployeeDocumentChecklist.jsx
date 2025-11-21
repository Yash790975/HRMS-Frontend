import { useState, useEffect } from 'react';
import { EmployeeDocumentChecklistAPI } from '../../../api/employeeDocumentChecklist';
import { BASE_URL } from '../../../api/api-config';

const EmployeeDocumentChecklist = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
  const [errors, setErrors] = useState({});
  const [documentChecklist, setDocumentChecklist] = useState({
    checklist_id: null,
    passport_size_photo: null,
    resume: null,
    signed_offer_letter: null,
    cheque_for_trainee: null,
    medical_certificate_for_trainee: null,
    pan_card: null,
    aadhaar_card: null,
    passport: null,
    tenth_marks_card: null,
    twelfth_marks_card: null,
    degree_marks_card_certificate: null,
    master_marks_card_certificate: null,
    current_local_address_proof: null,
    permanent_address_proof: null,
    experience_letter: null,
    relieving_letter: null,
    last_3months_payslip: null,
    physical_verification_date: ''
  });

  const [existingDocuments, setExistingDocuments] = useState({});
  const [fileInputs, setFileInputs] = useState({});

  // 🔥 Define required documents
  const REQUIRED_DOCUMENTS = [
    'passport_size_photo',
    'resume',
    'pan_card',
    'aadhaar_card',
    'tenth_marks_card',
    'twelfth_marks_card',
    'degree_marks_card_certificate',
    'current_local_address_proof',
    'permanent_address_proof'
  ];

  // Fetch document checklist when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchDocumentChecklistData();
    }
  }, [employeeId]);

  const fetchDocumentChecklistData = async () => {
    if (!employeeId) {
      console.log('No employee ID provided for document checklist fetch');
      return;
    }
    
    try {
      console.log('Fetching document checklist data for employee:', employeeId);
      setIsLoading(true);
      const response = await EmployeeDocumentChecklistAPI.getByEmployeeId(employeeId);

      console.log('Document Checklist API Response:', response);

      if (response.success && response.result) {
        const checklistData = response.result;
        
        // Store existing document URLs (API returns fields with _url suffix)
        const existingDocs = {};
        const documentFields = [
          'passport_size_photo', 'resume', 'signed_offer_letter', 'cheque_for_trainee',
          'medical_certificate_for_trainee', 'pan_card', 'aadhaar_card', 'passport',
          'tenth_marks_card', 'twelfth_marks_card', 'degree_marks_card_certificate',
          'master_marks_card_certificate', 'current_local_address_proof',
          'permanent_address_proof', 'experience_letter', 'relieving_letter',
          'last_3months_payslip'
        ];

        documentFields.forEach(field => {
          const urlField = `${field}_url`;
          if (checklistData[urlField]) {
            // Remove extra quotes if present
            let url = checklistData[urlField];
            if (typeof url === 'string') {
              url = url.replace(/^["']|["']$/g, '');
            }
            existingDocs[field] = url;
          }
        });

        setExistingDocuments(existingDocs);
        
        setDocumentChecklist({
          checklist_id: checklistData.checklist_id || checklistData.id || null,
          passport_size_photo: null,
          resume: null,
          signed_offer_letter: null,
          cheque_for_trainee: null,
          medical_certificate_for_trainee: null,
          pan_card: null,
          aadhaar_card: null,
          passport: null,
          tenth_marks_card: null,
          twelfth_marks_card: null,
          degree_marks_card_certificate: null,
          master_marks_card_certificate: null,
          current_local_address_proof: null,
          permanent_address_proof: null,
          experience_letter: null,
          relieving_letter: null,
          last_3months_payslip: null,
          physical_verification_date: checklistData.physical_verification_date || ''
        });
        
        console.log('Setting document checklist:', checklistData);
      } else {
        console.log('No document checklist data found for employee');
        resetDocumentChecklist();
      }
    } catch (error) {
      console.error('Error fetching document checklist data:', error);
      resetDocumentChecklist();
    } finally {
      setIsLoading(false);
    }
  };

  const resetDocumentChecklist = () => {
    setDocumentChecklist({
      checklist_id: null,
      passport_size_photo: null,
      resume: null,
      signed_offer_letter: null,
      cheque_for_trainee: null,
      medical_certificate_for_trainee: null,
      pan_card: null,
      aadhaar_card: null,
      passport: null,
      tenth_marks_card: null,
      twelfth_marks_card: null,
      degree_marks_card_certificate: null,
      master_marks_card_certificate: null,
      current_local_address_proof: null,
      permanent_address_proof: null,
      experience_letter: null,
      relieving_letter: null,
      last_3months_payslip: null,
      physical_verification_date: ''
    });
    setExistingDocuments({});
    setFileInputs({});
  };

  const handleSaveAndNext = async () => {
    const saved = await saveDocumentChecklist();
    if (saved && typeof onNextTab === 'function') {
      onComplete?.();
      onNextTab();
    }
  };

  const handleFileChange = (field, file) => {
    setDocumentChecklist(prev => ({
      ...prev,
      [field]: file
    }));

    setFileInputs(prev => ({
      ...prev,
      [field]: file
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDateChange = (value) => {
    setDocumentChecklist(prev => ({
      ...prev,
      physical_verification_date: value || null // 🔥 Convert empty string to null
    }));

    if (errors.physical_verification_date) {
      setErrors(prev => ({
        ...prev,
        physical_verification_date: ''
      }));
    }
  };

  const handleRemoveExisting = (field) => {
    // 🔥 Check if this is a required document
    if (REQUIRED_DOCUMENTS.includes(field)) {
      alert('This is a required document and cannot be removed. You can only replace it with a new file.');
      return;
    }

    if (window.confirm('Are you sure you want to remove this document? This will be saved when you update.')) {
      setExistingDocuments(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
      // Mark for deletion by setting a flag or empty value
      setDocumentChecklist(prev => ({
        ...prev,
        [field]: '' // Send empty string to indicate deletion
      }));
    }
  };

  // 🔥 Updated validation function
  const validateDocumentChecklist = () => {
    const newErrors = {};

    // Check each required document
    REQUIRED_DOCUMENTS.forEach(field => {
      const hasExisting = existingDocuments[field];
      const hasNew = fileInputs[field];
      
      if (!hasExisting && !hasNew) {
        const labelMap = {
          'passport_size_photo': 'Passport Size Photo',
          'resume': 'Resume/CV',
          'pan_card': 'PAN Card',
          'aadhaar_card': 'Aadhaar Card',
          'tenth_marks_card': '10th Marks Card',
          'twelfth_marks_card': '12th Marks Card',
          'degree_marks_card_certificate': 'Degree Certificate',
          'current_local_address_proof': 'Current Address Proof',
          'permanent_address_proof': 'Permanent Address Proof'
        };
        newErrors[field] = `${labelMap[field]} is required`;
      }
    });

    // Show general error if any required documents are missing
    if (Object.keys(newErrors).length > 0) {
      newErrors.general = 'Please upload all required documents (marked with *)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDocumentChecklist = async () => {
    if (!validateDocumentChecklist()) {
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    if (!employeeId) {
      alert('Please save personal details first');
      return false;
    }

    try {
      setIsLoading(true);
      let checklistData = {
        employee_id: employeeId
      };
      let isUpdate = documentChecklist.checklist_id !== null;

      console.log('Current document checklist:', documentChecklist);
      console.log('Is Update?', isUpdate);

      // Add all file fields
      const documentFields = [
        'passport_size_photo', 'resume', 'signed_offer_letter', 'cheque_for_trainee',
        'medical_certificate_for_trainee', 'pan_card', 'aadhaar_card', 'passport',
        'tenth_marks_card', 'twelfth_marks_card', 'degree_marks_card_certificate',
        'master_marks_card_certificate', 'current_local_address_proof',
        'permanent_address_proof', 'experience_letter', 'relieving_letter',
        'last_3months_payslip'
      ];

      documentFields.forEach(field => {
        if (documentChecklist[field] !== null) {
          checklistData[field] = documentChecklist[field];
        }
      });

      // 🔥 Add physical verification date with null handling
      checklistData.physical_verification_date = 
        documentChecklist.physical_verification_date?.trim() || null;

      if (isUpdate) {
        checklistData.checklist_id = documentChecklist.checklist_id;
        console.log('Updating document checklist with ID:', documentChecklist.checklist_id);
      } else {
        console.log('Adding new document checklist');
      }

      const response = isUpdate
        ? await EmployeeDocumentChecklistAPI.update(checklistData)
        : await EmployeeDocumentChecklistAPI.add(checklistData);

      if (response.success) {
        if (!isUpdate) {
          setDocumentChecklist(prev => ({
            ...prev,
            checklist_id: response.result?.checklist_id || response.result?.id
          }));
        }
        
        // Refresh the data to get updated document URLs
        await fetchDocumentChecklistData();
        
        return true;
      } else {
        alert(response.message || 'Failed to save document checklist');
        return false;
      }
    } catch (error) {
      console.error('Error saving document checklist:', error);
      alert(error.message || 'Backend server is not responding');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocumentChecklist = async () => {
    if (!documentChecklist.checklist_id) {
      alert('Cannot delete unsaved document checklist');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this document checklist?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await EmployeeDocumentChecklistAPI.delete(documentChecklist.checklist_id);

      if (response.success) {
        resetDocumentChecklist();
        alert('Document checklist deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete document checklist');
      }
    } catch (error) {
      console.error('Error deleting document checklist:', error);
      alert('Failed to delete document checklist');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentURL = (filename) => {
    if (!filename) return null;
    return `${BASE_URL}${filename}`;
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
  };

  const isPDFFile = (filename) => {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  };

  const renderFileInput = (field, label, required = false) => {
    const existingFile = existingDocuments[field];
    const newFile = fileInputs[field];

    return (
      <div className="form-group" key={field}>
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <input
          type="file"
          onChange={(e) => handleFileChange(field, e.target.files[0])}
          accept="image/*,.pdf"
          disabled={isLoading}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-sm ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        
        {/* Show existing document preview */}
        {existingFile && !newFile && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Current Document
              </span>
              {!required && (
                <button
                  onClick={() => handleRemoveExisting(field)}
                  disabled={isLoading}
                  className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
            
            {/* Image Preview */}
            {isImageFile(existingFile) && (
              <div className="mb-2">
                <img
                  src={getDocumentURL(existingFile)}
                  alt={label}
                  className="max-w-full h-auto max-h-48 rounded border border-gray-300 object-contain bg-white"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden p-4 bg-gray-100 rounded text-center text-sm text-gray-500">
                  Image preview not available
                </div>
              </div>
            )}
            
            {/* PDF Preview */}
            {isPDFFile(existingFile) && (
              <div className="mb-2 p-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">PDF Document</p>
                </div>
              </div>
            )}
            
            {/* View/Download Link */}
            <div className="flex gap-2">
              <a
                href={getDocumentURL(existingFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                View Document
              </a>
              <a
                href={getDocumentURL(existingFile)}
                download
                className="flex-1 text-center text-sm bg-gray-600 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition"
              >
                Download
              </a>
            </div>
          </div>
        )}
        
        {/* Show new file selected */}
        {newFile && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">New file selected</p>
                <p className="text-xs text-blue-700">{newFile.name}</p>
              </div>
            </div>
            {existingFile && (
              <p className="text-xs text-blue-600 mt-2">
                ⓘ This will replace the existing document when saved
              </p>
            )}
          </div>
        )}
        
        {errors[field] && <span className="text-red-500 text-sm mt-1 block">{errors[field]}</span>}
      </div>
    );
  };

  return (
    <div className="document-checklist-section p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="document-header mb-6 border-b pb-3">
        <h3 className="text-2xl font-semibold text-gray-800">Document Checklist</h3>
        <p className="text-sm text-gray-600 mt-1">Upload and manage employee documents</p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 text-sm font-medium">{errors.general}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Documents */}
        <div className="md:col-span-2 mt-2">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Documents</h4>
        </div>
        
        {renderFileInput('passport_size_photo', 'Passport Size Photo', true)}
        {renderFileInput('resume', 'Resume/CV', true)}
        {renderFileInput('signed_offer_letter', 'Signed Offer Letter')}

        {/* Training Documents */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Training Documents</h4>
        </div>
        
        {renderFileInput('cheque_for_trainee', 'Cheque for Trainee')}
        {renderFileInput('medical_certificate_for_trainee', 'Medical Certificate for Trainee')}

        {/* Identity Documents */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Identity Documents</h4>
        </div>
        
        {renderFileInput('pan_card', 'PAN Card', true)}
        {renderFileInput('aadhaar_card', 'Aadhaar Card', true)}
        {renderFileInput('passport', 'Passport')}

        {/* Educational Documents */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Educational Documents</h4>
        </div>
        
        {renderFileInput('tenth_marks_card', '10th Marks Card/Certificate', true)}
        {renderFileInput('twelfth_marks_card', '12th Marks Card/Certificate', true)}
        {renderFileInput('degree_marks_card_certificate', 'Degree Marks Card/Certificate', true)}
        {renderFileInput('master_marks_card_certificate', 'Master Marks Card/Certificate')}

        {/* Address Proof Documents */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Address Proof</h4>
        </div>
        
        {renderFileInput('current_local_address_proof', 'Current/Local Address Proof', true)}
        {renderFileInput('permanent_address_proof', 'Permanent Address Proof', true)}

        {/* Experience Documents */}
        <div className="md:col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Experience Documents</h4>
        </div>
        
        {renderFileInput('experience_letter', 'Experience Letter')}
        {renderFileInput('relieving_letter', 'Relieving Letter')}
        {renderFileInput('last_3months_payslip', 'Last 3 Months Payslip')}

        {/* Physical Verification Date */}
        <div className="md:col-span-2 mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Verification</h4>
        </div>
        
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Physical Verification Date
          </label>
          <input
            type="date"
            value={documentChecklist.physical_verification_date}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          {errors.physical_verification_date && (
            <span className="text-red-500 text-sm">{errors.physical_verification_date}</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="document-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8 pt-6 border-t">
        <div className="action-buttons flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveDocumentChecklist}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : documentChecklist.checklist_id ? 'Update Documents' : 'Save Documents'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Finish 🎉'}
          </button>

          {documentChecklist.checklist_id && (
            <button
              type="button"
              onClick={handleDeleteDocumentChecklist}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Display */}
      <div className="document-info mt-6 text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">
          Status: {documentChecklist.checklist_id ? '✓ Document checklist saved' : '○ No documents saved yet'}
        </p>
        <p className="text-xs text-gray-600">
          📄 Supported formats: Images (JPG, PNG) and PDF files
        </p>
        <p className="text-xs text-red-600 font-medium mt-1">
          ⚠️ Documents marked with * are mandatory and must be uploaded
        </p>
        <p className="text-xs text-gray-600 mt-1">
          ℹ Required documents cannot be removed, only replaced
        </p>
      </div>
    </div>
  );
};

export default EmployeeDocumentChecklist;




































// import { useState, useEffect } from 'react';
// import { EmployeeDocumentChecklistAPI } from '../../../api/employeeDocumentChecklist';
// import { BASE_URL } from '../../../api/api-config';

// const EmployeeDocumentChecklist = ({ employeeId, isLoading, setIsLoading, onNextTab, onComplete }) => {
//   const [errors, setErrors] = useState({});
//   const [documentChecklist, setDocumentChecklist] = useState({
//     checklist_id: null,
//     passport_size_photo: null,
//     resume: null,
//     signed_offer_letter: null,
//     cheque_for_trainee: null,
//     medical_certificate_for_trainee: null,
//     pan_card: null,
//     aadhaar_card: null,
//     passport: null,
//     tenth_marks_card: null,
//     twelfth_marks_card: null,
//     degree_marks_card_certificate: null,
//     master_marks_card_certificate: null,
//     current_local_address_proof: null,
//     permanent_address_proof: null,
//     experience_letter: null,
//     relieving_letter: null,
//     last_3months_payslip: null,
//     physical_verification_date: ''
//   });

//   const [existingDocuments, setExistingDocuments] = useState({});
//   const [fileInputs, setFileInputs] = useState({});

//   // Fetch document checklist when component mounts or employeeId changes
//   useEffect(() => {
//     if (employeeId) {
//       fetchDocumentChecklistData();
//     }
//   }, [employeeId]);

//   const fetchDocumentChecklistData = async () => {
//     if (!employeeId) {
//       console.log('No employee ID provided for document checklist fetch');
//       return;
//     }
    
//     try {
//       console.log('Fetching document checklist data for employee:', employeeId);
//       setIsLoading(true);
//       const response = await EmployeeDocumentChecklistAPI.getByEmployeeId(employeeId);

//       console.log('Document Checklist API Response:', response);

//       if (response.success && response.result) {
//         const checklistData = response.result;
        
//         // Store existing document URLs (API returns fields with _url suffix)
//         const existingDocs = {};
//         const documentFields = [
//           'passport_size_photo', 'resume', 'signed_offer_letter', 'cheque_for_trainee',
//           'medical_certificate_for_trainee', 'pan_card', 'aadhaar_card', 'passport',
//           'tenth_marks_card', 'twelfth_marks_card', 'degree_marks_card_certificate',
//           'master_marks_card_certificate', 'current_local_address_proof',
//           'permanent_address_proof', 'experience_letter', 'relieving_letter',
//           'last_3months_payslip'
//         ];

//         documentFields.forEach(field => {
//           const urlField = `${field}_url`;
//           if (checklistData[urlField]) {
//             // Remove extra quotes if present
//             let url = checklistData[urlField];
//             if (typeof url === 'string') {
//               url = url.replace(/^["']|["']$/g, '');
//             }
//             existingDocs[field] = url;
//           }
//         });

//         setExistingDocuments(existingDocs);
        
//         setDocumentChecklist({
//           checklist_id: checklistData.checklist_id || checklistData.id || null,
//           passport_size_photo: null,
//           resume: null,
//           signed_offer_letter: null,
//           cheque_for_trainee: null,
//           medical_certificate_for_trainee: null,
//           pan_card: null,
//           aadhaar_card: null,
//           passport: null,
//           tenth_marks_card: null,
//           twelfth_marks_card: null,
//           degree_marks_card_certificate: null,
//           master_marks_card_certificate: null,
//           current_local_address_proof: null,
//           permanent_address_proof: null,
//           experience_letter: null,
//           relieving_letter: null,
//           last_3months_payslip: null,
//           physical_verification_date: checklistData.physical_verification_date || ''
//         });
        
//         console.log('Setting document checklist:', checklistData);
//       } else {
//         console.log('No document checklist data found for employee');
//         resetDocumentChecklist();
//       }
//     } catch (error) {
//       console.error('Error fetching document checklist data:', error);
//       resetDocumentChecklist();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetDocumentChecklist = () => {
//     setDocumentChecklist({
//       checklist_id: null,
//       passport_size_photo: null,
//       resume: null,
//       signed_offer_letter: null,
//       cheque_for_trainee: null,
//       medical_certificate_for_trainee: null,
//       pan_card: null,
//       aadhaar_card: null,
//       passport: null,
//       tenth_marks_card: null,
//       twelfth_marks_card: null,
//       degree_marks_card_certificate: null,
//       master_marks_card_certificate: null,
//       current_local_address_proof: null,
//       permanent_address_proof: null,
//       experience_letter: null,
//       relieving_letter: null,
//       last_3months_payslip: null,
//       physical_verification_date: ''
//     });
//     setExistingDocuments({});
//     setFileInputs({});
//   };

//   const handleSaveAndNext = async () => {
//     const saved = await saveDocumentChecklist();
//     if (saved && typeof onNextTab === 'function') {
//         onComplete?.(); // ✅ Mark this tab as completed
//         // alert('Docs saved successfully!');
//       onNextTab();
//     }
//   };

//   const handleFileChange = (field, file) => {
//     setDocumentChecklist(prev => ({
//       ...prev,
//       [field]: file
//     }));

//     setFileInputs(prev => ({
//       ...prev,
//       [field]: file
//     }));

//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const handleDateChange = (value) => {
//     setDocumentChecklist(prev => ({
//       ...prev,
//       physical_verification_date: value
//     }));

//     if (errors.physical_verification_date) {
//       setErrors(prev => ({
//         ...prev,
//         physical_verification_date: ''
//       }));
//     }
//   };

//   const handleRemoveExisting = (field) => {
//     if (window.confirm('Are you sure you want to remove this document? This will be saved when you update.')) {
//       setExistingDocuments(prev => {
//         const updated = { ...prev };
//         delete updated[field];
//         return updated;
//       });
//       // Mark for deletion by setting a flag or empty value
//       setDocumentChecklist(prev => ({
//         ...prev,
//         [field]: '' // Send empty string to indicate deletion
//       }));
//     }
//   };

//   const validateDocumentChecklist = () => {
//     const newErrors = {};

//     // At least one document should be uploaded
//     const hasAnyDocument = Object.keys(fileInputs).length > 0 || Object.keys(existingDocuments).length > 0;
    
//     if (!hasAnyDocument && !documentChecklist.checklist_id) {
//       newErrors.general = 'Please upload at least one document';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveDocumentChecklist = async () => {
//     if (!validateDocumentChecklist()) {
//       return false;
//     }

//     if (!employeeId) {
//       alert('Please save personal details first');
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       let checklistData = {
//         employee_id: employeeId
//       };
//       let isUpdate = documentChecklist.checklist_id !== null;

//       console.log('Current document checklist:', documentChecklist);
//       console.log('Is Update?', isUpdate);

//       // Add all file fields
//       const documentFields = [
//         'passport_size_photo', 'resume', 'signed_offer_letter', 'cheque_for_trainee',
//         'medical_certificate_for_trainee', 'pan_card', 'aadhaar_card', 'passport',
//         'tenth_marks_card', 'twelfth_marks_card', 'degree_marks_card_certificate',
//         'master_marks_card_certificate', 'current_local_address_proof',
//         'permanent_address_proof', 'experience_letter', 'relieving_letter',
//         'last_3months_payslip'
//       ];

//       documentFields.forEach(field => {
//         if (documentChecklist[field] !== null) {
//           checklistData[field] = documentChecklist[field];
//         }
//       });

//       // Add physical verification date
//       if (documentChecklist.physical_verification_date) {
//         checklistData.physical_verification_date = documentChecklist.physical_verification_date;
//       }

//       if (isUpdate) {
//         checklistData.checklist_id = documentChecklist.checklist_id;
//         console.log('Updating document checklist with ID:', documentChecklist.checklist_id);
//       } else {
//         console.log('Adding new document checklist');
//       }

//       const response = isUpdate
//         ? await EmployeeDocumentChecklistAPI.update(checklistData)
//         : await EmployeeDocumentChecklistAPI.add(checklistData);

//       if (response.success) {
//         if (!isUpdate) {
//           setDocumentChecklist(prev => ({
//             ...prev,
//             checklist_id: response.result?.checklist_id || response.result?.id
//           }));
//         }
        
//         // Refresh the data to get updated document URLs
//         await fetchDocumentChecklistData();
        
//         // alert(`Document checklist ${isUpdate ? 'updated' : 'added'} successfully!`);
//         return true;
//       } else {
//         alert(response.message || 'Failed to save document checklist');
//         return false;
//       }
//     } catch (error) {
//       console.error('Error saving document checklist:', error);
//       alert(error.message || 'Backend server is not responding');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteDocumentChecklist = async () => {
//     if (!documentChecklist.checklist_id) {
//       alert('Cannot delete unsaved document checklist');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to delete this document checklist?')) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await EmployeeDocumentChecklistAPI.delete(documentChecklist.checklist_id);

//       if (response.success) {
//         resetDocumentChecklist();
//         alert('Document checklist deleted successfully!');
//       } else {
//         alert(response.message || 'Failed to delete document checklist');
//       }
//     } catch (error) {
//       console.error('Error deleting document checklist:', error);
//       alert('Failed to delete document checklist');
//     } finally {
//       setIsLoading(false);
//     }
//   };

// //   const getDocumentURL = (filename) => {
// //     if (!filename) return null;
// //     // Remove leading slash if present since BASE_URL already has the base path
// //     const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;
// //     return `${BASE_URL}/${cleanFilename}`;
// //   };

//   const getDocumentURL = (filename) => {
//   if (!filename) return null;
//   return `${BASE_URL}${filename}`;
// };


//   const isImageFile = (filename) => {
//     if (!filename) return false;
//     const ext = filename.split('.').pop().toLowerCase();
//     return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
//   };

//   const isPDFFile = (filename) => {
//     if (!filename) return false;
//     return filename.toLowerCase().endsWith('.pdf');
//   };

//   const renderFileInput = (field, label, required = false) => {
//     const existingFile = existingDocuments[field];
//     const newFile = fileInputs[field];

//     return (
//       <div className="form-group" key={field}>
//         <label className="block text-gray-700 font-medium mb-2">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
        
//         <input
//           type="file"
//           onChange={(e) => handleFileChange(field, e.target.files[0])}
//           accept="image/*,.pdf"
//           disabled={isLoading}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-sm"
//         />
        
//         {/* Show existing document preview */}
//         {existingFile && !newFile && (
//           <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//             <div className="flex items-start justify-between mb-2">
//               <span className="text-sm font-medium text-green-600 flex items-center gap-1">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 Current Document
//               </span>
//               <button
//                 onClick={() => handleRemoveExisting(field)}
//                 disabled={isLoading}
//                 className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
//               >
//                 Remove
//               </button>
//             </div>
            
//             {/* Image Preview */}
//             {isImageFile(existingFile) && (
//               <div className="mb-2">
//                 <img
//                   src={getDocumentURL(existingFile)}
//                   alt={label}
//                   className="max-w-full h-auto max-h-48 rounded border border-gray-300 object-contain bg-white"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'block';
//                   }}
//                 />
//                 <div className="hidden p-4 bg-gray-100 rounded text-center text-sm text-gray-500">
//                   Image preview not available
//                 </div>
//               </div>
//             )}
            
//             {/* PDF Preview */}
//             {isPDFFile(existingFile) && (
//               <div className="mb-2 p-4 bg-white rounded border border-gray-300 flex items-center justify-center">
//                 <div className="text-center">
//                   <svg className="w-12 h-12 mx-auto text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
//                   </svg>
//                   <p className="text-sm font-medium text-gray-700">PDF Document</p>
//                 </div>
//               </div>
//             )}
            
//             {/* View/Download Link */}
//             <div className="flex gap-2">
//               <a
//                 href={getDocumentURL(existingFile)}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex-1 text-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
//               >
//                 View Document
//               </a>
//               <a
//                 href={getDocumentURL(existingFile)}
//                 download
//                 className="flex-1 text-center text-sm bg-gray-600 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition"
//               >
//                 Download
//               </a>
//             </div>
//           </div>
//         )}
        
//         {/* Show new file selected */}
//         {newFile && (
//           <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-blue-900">New file selected</p>
//                 <p className="text-xs text-blue-700">{newFile.name}</p>
//               </div>
//             </div>
//             {existingFile && (
//               <p className="text-xs text-blue-600 mt-2">
//                 ⓘ This will replace the existing document when saved
//               </p>
//             )}
//           </div>
//         )}
        
//         {errors[field] && <span className="text-red-500 text-sm mt-1 block">{errors[field]}</span>}
//       </div>
//     );
//   };

//   return (
//     <div className="document-checklist-section p-6 bg-white rounded-2xl shadow-md">
//       {/* Header */}
//       <div className="document-header mb-6 border-b pb-3">
//         <h3 className="text-2xl font-semibold text-gray-800">Document Checklist</h3>
//         <p className="text-sm text-gray-600 mt-1">Upload and manage employee documents</p>
//       </div>

//       {errors.general && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <span className="text-red-600 text-sm">{errors.general}</span>
//         </div>
//       )}

//       {/* Form Fields */}
//       <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Basic Documents */}
//         <div className="md:col-span-2 mt-2">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Documents</h4>
//         </div>
        
//         {renderFileInput('passport_size_photo', 'Passport Size Photo', true)}
//         {renderFileInput('resume', 'Resume/CV', true)}
//         {renderFileInput('signed_offer_letter', 'Signed Offer Letter', true)}

//         {/* Training Documents */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Training Documents</h4>
//         </div>
        
//         {renderFileInput('cheque_for_trainee', 'Cheque for Trainee')}
//         {renderFileInput('medical_certificate_for_trainee', 'Medical Certificate for Trainee')}

//         {/* Identity Documents */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Identity Documents</h4>
//         </div>
        
//         {renderFileInput('pan_card', 'PAN Card', true)}
//         {renderFileInput('aadhaar_card', 'Aadhaar Card', true)}
//         {renderFileInput('passport', 'Passport')}

//         {/* Educational Documents */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Educational Documents</h4>
//         </div>
        
//         {renderFileInput('tenth_marks_card', '10th Marks Card/Certificate', true)}
//         {renderFileInput('twelfth_marks_card', '12th Marks Card/Certificate')}
//         {renderFileInput('degree_marks_card_certificate', 'Degree Marks Card/Certificate')}
//         {renderFileInput('master_marks_card_certificate', 'Master Marks Card/Certificate')}

//         {/* Address Proof Documents */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Address Proof</h4>
//         </div>
        
//         {renderFileInput('current_local_address_proof', 'Current/Local Address Proof', true)}
//         {renderFileInput('permanent_address_proof', 'Permanent Address Proof')}

//         {/* Experience Documents */}
//         <div className="md:col-span-2 mt-4">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Experience Documents</h4>
//         </div>
        
//         {renderFileInput('experience_letter', 'Experience Letter')}
//         {renderFileInput('relieving_letter', 'Relieving Letter')}
//         {renderFileInput('last_3months_payslip', 'Last 3 Months Payslip')}

//         {/* Physical Verification Date */}
//         <div className="md:col-span-2 mt-6">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Verification</h4>
//         </div>
        
//         <div className="form-group md:col-span-2">
//           <label className="block text-gray-700 font-medium mb-2">
//             Physical Verification Date
//           </label>
//           <input
//             type="date"
//             value={documentChecklist.physical_verification_date}
//             onChange={(e) => handleDateChange(e.target.value)}
//             disabled={isLoading}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
//           />
//           {errors.physical_verification_date && (
//             <span className="text-red-500 text-sm">{errors.physical_verification_date}</span>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="document-actions flex flex-col md:flex-row justify-end items-center gap-4 mt-8 pt-6 border-t">
//         <div className="action-buttons flex flex-wrap gap-3">
//           <button
//             type="button"
//             onClick={saveDocumentChecklist}
//             disabled={isLoading}
//             className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : documentChecklist.checklist_id ? 'Update Documents' : 'Save Documents'}
//           </button>

//           <button
//             type="button"
//             onClick={handleSaveAndNext}
//             disabled={isLoading}
//             className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm disabled:opacity-50"
//           >
//             {isLoading ? 'Saving...' : 'Save & Next →'}
//           </button>

//           {documentChecklist.checklist_id && (
//             <button
//               type="button"
//               onClick={handleDeleteDocumentChecklist}
//               disabled={isLoading}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm disabled:opacity-50"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Info Display */}
//       <div className="document-info mt-6 text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
//         <p className="font-medium mb-2">
//           Status: {documentChecklist.checklist_id ? '✓ Document checklist saved' : '○ No documents saved yet'}
//         </p>
//         <p className="text-xs text-gray-600">
//           📄 Supported formats: Images (JPG, PNG) and PDF files
//         </p>
//         <p className="text-xs text-gray-600 mt-1">
//           ⚠️ Documents marked with * are mandatory
//         </p>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDocumentChecklist;






























