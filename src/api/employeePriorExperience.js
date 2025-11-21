import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeePriorExperienceAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.ADD, {
      method: 'POST',
      body: data
    });
  }, 

  update: async (data) => {
    if (!data.experience_id) throw new Error("Prior experience ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.GET_BY_ID(id), { method: 'GET' }),

  getByEmployeeId: (employeeId) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_PRIOR_EXPERIENCE.DELETE(id), { method: 'DELETE' })
};
