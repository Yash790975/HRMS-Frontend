import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeeRolesAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_ROELS.ADD, {
      method: 'POST',
      body: data
    });
  },

  update: async (data) => {
    if (!data.id) throw new Error("Employee Roles ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_ROELS.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_ROELS.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_ROELS.GET_BY_ID(id), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_ROELS.DELETE(id), { method: 'DELETE' })
};
