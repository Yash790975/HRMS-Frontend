// src/api/employeeDocumentChecklist.js

import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeeDocumentChecklistAPI = {
  
  // =========================================================
  // Add Document Checklist (Handles Images)
  // =========================================================
  add: async (data) => {
    const formData = new FormData();

    // Append all fields dynamically (including files)
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    return apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.ADD, {
      method: 'POST',
      body: formData,
      isFormData: true, // important: prevents JSON headers
    });
  },

  // =========================================================
  // Update Document Checklist (Handles Images)
  // =========================================================
  update: async (data) => {
    if (!data.checklist_id) {
      throw new Error("Document Checklist ID is required for update");
    }

    const formData = new FormData();

    // Append all fields dynamically (including files)
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    return apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.UPDATE, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  // =========================================================
  // Get All
  // =========================================================
  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.GET_ALL, {
      method: 'GET',
    }),

  // =========================================================
  // Get By ID
  // =========================================================
  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.GET_BY_ID(id), {
      method: 'GET',
    }),

  // =========================================================
  // Get By Employee ID
  // =========================================================
  getByEmployeeId: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.GET_BY_EMPLOYEE_ID(id), {
      method: 'GET',
    }),

  // =========================================================
  // Delete
  // =========================================================
  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_DOCUMENT_CHECKLIST.DELETE(id), {
      method: 'DELETE',
    }),
};
