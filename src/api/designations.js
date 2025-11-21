import { API_ENDPOINTS } from './api-config';
import { apiCall } from './fetchHelper';

export const DesignationsAPI = {

  // Add new designation
  add: async (data) => {
    return apiCall(API_ENDPOINTS.DESIGNATIONS.ADD, {
      method: 'POST',
      body: {
        name: data.name
      }
    });
  },

  // Update existing designation
  update: async (data) => {
    if (!data.id) throw new Error("Designation ID is required for update");

    return apiCall(API_ENDPOINTS.DESIGNATIONS.UPDATE, {
      method: 'POST',
      body: {
        id: data.id,
        name: data.name
      }
    });
  },

  // Get all designations
  getAll: () =>
    apiCall(API_ENDPOINTS.DESIGNATIONS.GET_ALL, { method: 'GET' }),

  // Get designation by ID
  getById: (id) =>
    apiCall(API_ENDPOINTS.DESIGNATIONS.GET_BY_ID(id), { method: 'GET' }),

  // Delete designation by ID
  delete: (id) =>
    apiCall(API_ENDPOINTS.DESIGNATIONS.DELETE(id), { method: 'DELETE' }),
};