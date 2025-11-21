import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeeSkillsAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.ADD, {
      method: 'POST',
      body: data
    });
  },

  update: async (data) => {
    if (!data.skill_id) throw new Error("Skills ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.GET_BY_ID(id), { method: 'GET' }),

  getByEmployeeId: (employeeId) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_SKILLS.DELETE(id), { method: 'DELETE' })
};
