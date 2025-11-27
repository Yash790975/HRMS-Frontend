import { API_ENDPOINTS } from "./api-config";
import { apiCall } from "./fetchHelper";

  
export const EmployeeMasterAPI = {
  // Add new employee
  add: (data) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.ADD, "POST", data),

  // Update employee
  update: (data) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.UPDATE, "POST", data),

  // Get all employees 
  getAll: () => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.GET_ALL, "GET"),

  // Get employee by ID
  getById: (id) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.GET_BY_ID(id), "GET"),

  // Delete employee by ID
  delete: (id) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.DELETE(id), "DELETE"),

  // Get employee by code
  getByCode: (code) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.GET_BY_CODE(code), "GET"),

  // Get employee by mobile number
  getByMobile: (mobile) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.GET_BY_MOBILE(mobile), "GET"),

  // Activate employee
  activate: (id) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.ACTIVATE(id), "PATCH"),

  // Deactivate employee
  deactivate: (id) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.DEACTIVATE(id), "PATCH"),


  // Confirm probation (only probation-related fields)
  confirmProbation: (id) => apiCall(API_ENDPOINTS.EMPLOYEE_MASTER.CONFIRM_PROBATION(id), "PATCH"),
};
