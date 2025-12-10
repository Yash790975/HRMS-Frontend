export const BASE_URL = "http://localhost:3000/hrms/";
// export const BASE_URL = "http://hrms.api.vastorax.com/hrms/";
//For Images
export const IMAGE_BASE_URL = "http://localhost:3000/hrms";
// export const IMAGE_BASE_URL = "http://hrms.api.vastorax.com/hrms";

export const API_ENDPOINTS = {
  // ========================================
  // Admin Management
  // ========================================
  ADMIN: {
    ADD: `${BASE_URL}admin/add`,
    UPDATE: `${BASE_URL}admin/update`,
    GET_ALL: `${BASE_URL}admin/getAll`,
    GET_BY_ID: (id) => `${BASE_URL}admin/getById/${id}`,
    DELETE: (id) => `${BASE_URL}admin/${id}`,
    LOGIN: `${BASE_URL}admin/login`,
    REQUEST_OTP: `${BASE_URL}admin/request-otp`,
    VERIFY_OTP: `${BASE_URL}admin/verify-otp`,
    CHANGE_PASSWORD: `${BASE_URL}admin/change-password`,
  },

  // ========================================
  // Authentication
  // ========================================
  AUTH: {
    LOGIN: `${BASE_URL}auth/login`,
    REGISTER: `${BASE_URL}auth/register`,
    VERIFY_EMAIL: `${BASE_URL}auth/verify-email`,
    FORGOT_PASSWORD: `${BASE_URL}auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}auth/reset-password`,
  },

  // ========================================
  // Department Management
  // ========================================
  DEPARTMENTS: {
    ADD: `${BASE_URL}employee/department/add`,
    UPDATE: `${BASE_URL}employee/department/update`,
    GET_ALL: `${BASE_URL}employee/departments`,
    GET_BY_ID: (id) => `${BASE_URL}employee/department/${id}`,
    DELETE: (id) => `${BASE_URL}employee/department/delete/${id}`,
  },



  // ========================================
  // Designation Management
  // ========================================
  DESIGNATIONS: {
    ADD: `${BASE_URL}employee/designation/add`,
    UPDATE: `${BASE_URL}employee/designation/update`,
    GET_ALL: `${BASE_URL}employee/designations`,
    GET_BY_ID: (id) => `${BASE_URL}employee/designation/${id}`,
    DELETE: (id) => `${BASE_URL}employee/designation/delete/${id}`,
  },

  // ========================================
  // Office Location Management
  // ========================================
  OFFICE_LOCATIONS: {
    ADD: `${BASE_URL}employee/office-location/add`,
    UPDATE: `${BASE_URL}employee/office-location/update`,
    GET_ALL: `${BASE_URL}employee/office-locations`,
    GET_BY_ID: (id) => `${BASE_URL}employee/office-location/${id}`,
    DELETE: (id) => `${BASE_URL}employee/office-location/delete/${id}`,
  },

  // ========================================
  // Employee Master
  // ========================================
  EMPLOYEE_MASTER: {
    ADD: `${BASE_URL}employee/add`,
    UPDATE: `${BASE_URL}employee/update`,
    GET_ALL: `${BASE_URL}employees`,
    GET_BY_ID: (id) => `${BASE_URL}employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/delete/${id}`,
    GET_BY_CODE: (code) => `${BASE_URL}employee/code/${code}`,
    GET_BY_MOBILE: (mobile) => `${BASE_URL}employee/mobile/${mobile}`,
    ACTIVATE: (id) => `${BASE_URL}employee/activate/${id}`,
    DEACTIVATE: (id) => `${BASE_URL}employee/deactivate/${id}`,
    CONFIRM_PROBATION: (id) => `${BASE_URL}employee/confirm-probation/${id}`, // ✅ Add this line

    
  },

  // ========================================
  // Employee Passport Details
  // ========================================
  EMPLOYEE_PASSPORT_DETAILS: {
    ADD: `${BASE_URL}employee/passport-details/add`,
    UPDATE: `${BASE_URL}employee/passport-details/update`,
    GET_ALL: `${BASE_URL}employee/passport-details/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/passport-details/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/passport-details/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/passport-details/delete/${id}`,
  },

  // ========================================
  // Employee Prior Experience
  // ========================================
  EMPLOYEE_PRIOR_EXPERIENCE: {
    ADD: `${BASE_URL}employee/prior-experience/add`,
    UPDATE: `${BASE_URL}employee/prior-experience/update`,
    GET_ALL: `${BASE_URL}employee/prior-experience/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/prior-experience/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/prior-experience/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/prior-experience/delete/${id}`,
  },

  // ========================================
  // Employee Family Details
  // ========================================
  EMPLOYEE_FAMILY_DETAILS: {
    ADD: `${BASE_URL}employee/family-details/add`,
    UPDATE: `${BASE_URL}employee/family-details/update`,
    GET_ALL: `${BASE_URL}employee/family-details/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/family-details/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/family-details/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/family-details/delete/${id}`,
  },

  // ========================================
  // Employee Insurance Details 🩺
  // ========================================
  EMPLOYEE_INSURANCE_DETAILS: {
    ADD: `${BASE_URL}employee/insurance-details/add`,
    UPDATE: `${BASE_URL}employee/insurance-details/update`,
    GET_ALL: `${BASE_URL}employee/insurance-details/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/insurance-details/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/insurance-details/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/insurance-details/delete/${id}`,
  },

  // ========================================
  // Employee Skills 💼
  // ========================================
  EMPLOYEE_SKILLS: {
    ADD: `${BASE_URL}employee/skills/add`,
    UPDATE: `${BASE_URL}employee/skills/update`,
    GET_ALL: `${BASE_URL}employee/skills/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/skills/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) => `${BASE_URL}employee/skills/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/skills/delete/${id}`,
  },

  // ========================================
  // Employee Children Details 👶
  // ========================================
  EMPLOYEE_CHILDREN_DETAILS: {
    ADD: `${BASE_URL}employee/children-details/add`,
    UPDATE: `${BASE_URL}employee/children-details/update`,
    GET_ALL: `${BASE_URL}employee/children-details/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/children-details/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/children-details/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/children-details/delete/${id}`,
  },

  // ========================================
  // Employee Children Details 👶
  // ========================================
  EMPLOYEE_REFERENCES: {
    ADD: `${BASE_URL}employee/references/add`,
    UPDATE: `${BASE_URL}employee/references/update`,
    GET_ALL: `${BASE_URL}employee/references/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/references/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/references/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/references/delete/${id}`,
  },


  EMPLOYEE_ROELS: {
    ADD: `${BASE_URL}employee/role/add`,
    UPDATE: `${BASE_URL}employee/role/update`,
    GET_ALL: `${BASE_URL}employee/roles/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/role/${id}`,
    DELETE: (id) => `${BASE_URL}employee/role/delete/${id}`,
  },


  // Employee Bank Account Details 👶
  // ========================================

  EMPLOYEE_BANK_ACCOUNT_DETAILS: {
    ADD: `${BASE_URL}employee/bank-account-details/add`,
    UPDATE: `${BASE_URL}employee/bank-account-details/update`,
    GET_ALL: `${BASE_URL}employee/bank-account-details/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/bank-account-details/by-id/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/bank-account-details/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/bank-account-details/delete/${id}`,
  },


  EMPLOYEE_DOCUMENT_CHECKLIST: {
    ADD: `${BASE_URL}employee/document-checklist/add`,
    UPDATE: `${BASE_URL}employee/document-checklist/update`,
    GET_ALL: `${BASE_URL}employee/document-checklists/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/document-checklist/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/document-checklist/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/document-checklist/delete/${id}`,
  },
  
  EMPLOYEE_STATUS_HISTORY: {
    ADD: `${BASE_URL}employee/status-history/add`,
    UPDATE: `${BASE_URL}employee/status-history/update`,
    GET_ALL: `${BASE_URL}employee/status-history/all`,
    GET_BY_ID: (id) => `${BASE_URL}employee/status-history/${id}`,
    GET_BY_EMPLOYEE_ID: (id) =>
      `${BASE_URL}employee/status-history/employee/${id}`,
    DELETE: (id) => `${BASE_URL}employee/status-history/delete/${id}`,
  },


};

// ========================================
// API Configuration
// ========================================
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  USE_FALLBACK_DATA: true,
  ENABLE_LOGGING: true,
};
