import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const EmployeeChildrenDetailsAPI = {
  add: async (data) => {
    return apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.ADD, {
      method: 'POST',     
      body: data
    });
  },
 
  update: async (data) => {
    if (!data.child_id) throw new Error("Children details ID is required for update");
    return apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.UPDATE, {
      method: 'POST',
      body: data
    });
  },

  getAll: () =>
    apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.GET_ALL, { method: 'GET' }),

  getById: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.GET_BY_ID(id), { method: 'GET' }),

  getByEmployeeId: (employeeId) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.EMPLOYEE_CHILDREN_DETAILS.DELETE(id), { method: 'DELETE' })
};
