import { API_ENDPOINTS } from "./api-config";

/**
 * Employee Status History API
 */
export const EmployeeStatusHistoryAPI = {
  /**
   * Add new status history record
   */
  async add(statusData) {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.ADD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding status history:", error);
      throw error;
    }
  },

  /**
   * Get all status history records
   */
  async getAll() {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_ALL);
      return await response.json();
    } catch (error) {
      console.error("Error fetching status history:", error);
      throw error;
    }
  },

  /**
   * Get status history by ID
   */
  async getById(id) {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_BY_ID(id));
      return await response.json();
    } catch (error) {
      console.error("Error fetching status history by ID:", error);
      throw error;
    }
  },

  /**
   * Get status history by employee ID
   */
  async getByEmployeeId(employmentDetailId) {
    try {
      const response = await fetch(
        API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_BY_EMPLOYMENT_DETAIL_ID(employmentDetailId)
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching status history by employee ID:", error);
      throw error;
    }
  },

  /**
   * Update status history record
   */
  async update(id, statusData) {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...statusData }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating status history:", error);
      throw error;
    }
  },

  /**
   * Delete status history record
   */
  async delete(id) {
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.DELETE(id), {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting status history:", error);
      throw error;
    }
  },
};



// import { API_ENDPOINTS } from './api-config';
// import { apiCall } from './fetchHelper';

// export const EmployeeStatusHistory = {
//   add: async (data) => {
//     return apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.ADD, {
//       method: 'POST',
//       body: data
//     });
//   },

//   update: async (data) => {
//     if (!data.id) throw new Error("history ID is required for update");
//     return apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.UPDATE, {
//       method: 'POST',
//       body: data
//     });
//   },

//   getAll: () =>
//     apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_ALL, { method: 'GET' }),

//   getById: (id) =>
//     apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_BY_ID(id), { method: 'GET' }),

//   getByEmployeeId: (employeeId) =>
//     apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.GET_BY_EMPLOYEE_ID(employeeId), { method: 'GET' }),

//   delete: (id) =>
//     apiCall(API_ENDPOINTS.EMPLOYEE_STATUS_HISTORY.DELETE(id), { method: 'DELETE' })
// };
