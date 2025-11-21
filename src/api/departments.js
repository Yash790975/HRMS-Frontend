import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const DepartmentsAPI = {

  // Add new department
  add: async (data) => {
    return apiCall(API_ENDPOINTS.DEPARTMENTS.ADD, {
      method: 'POST',
      body: {
        name: data.name
      }
    });
  },

  // Update existing department
  update: async (data) => {
    if (!data.id) throw new Error("Department ID is required for update");

    return apiCall(API_ENDPOINTS.DEPARTMENTS.UPDATE, {
      method: 'POST',
      body: {
        id: data.id,
        name: data.name
      }
    });
  },

  // Get all departments
  getAll: () =>
    apiCall(API_ENDPOINTS.DEPARTMENTS.GET_ALL, { method: 'GET' }),

  // Get department by ID
  getById: (id) =>
    apiCall(API_ENDPOINTS.DEPARTMENTS.GET_BY_ID(id), { method: 'GET' }),

  // Delete department by ID
  delete: (id) =>
    apiCall(API_ENDPOINTS.DEPARTMENTS.DELETE(id), { method: 'DELETE' }),
};