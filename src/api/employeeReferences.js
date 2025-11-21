import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeeReferenceseAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.ADD, {
      method: 'POST',
      body: data
    });
  },

  update: async (data) => {
    if (!data.reference_id) throw new Error("Employee Reference ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.GET_BY_ID(id), { method: 'GET' }),

  getByEmployeeId: (employeeId) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_REFERENCES.DELETE(id), { method: 'DELETE' })
};
