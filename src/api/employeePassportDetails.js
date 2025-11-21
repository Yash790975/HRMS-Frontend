import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeePassportDetailsAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.ADD, {
      method: 'POST',
      body: data
    });
  }, 

  update: async (data) => {
    // if (!data.id) throw new Error("Passport details ID is required for update");
if (!data.passport_id) throw new Error("Passport details ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.GET_BY_ID(id), { method: 'GET' }),

  getByEmployeeId: (employeeId) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PASSPORT_DETAILS.DELETE(id), { method: 'DELETE' })
};
