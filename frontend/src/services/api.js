import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Client API
export const clientAPI = {
  // Get all clients
  getClients: async () => {
    try {
      const response = await apiClient.get('/clients/');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get client by ID
  getClient: async (clientId) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create new client
  createClient: async (clientData) => {
    try {
      const response = await apiClient.post('/clients/', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await apiClient.delete(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

// Test Results API
export const testResultAPI = {
  // Get all test results for a client
  getClientTestResults: async (clientId) => {
    try {
      const response = await apiClient.get(`/test-results/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  },

  // Get test result by ID
  getTestResult: async (testId) => {
    try {
      const response = await apiClient.get(`/test-results/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  },

  // Create new test result
  createTestResult: async (testData) => {
    try {
      const response = await apiClient.post('/test-results/', testData);
      return response.data;
    } catch (error) {
      console.error('Error creating test result:', error);
      throw error;
    }
  },

  // Delete test result
  deleteTestResult: async (testId) => {
    try {
      const response = await apiClient.delete(`/test-results/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw error;
    }
  }
};

// FMS Exercises API
export const fmsExercisesAPI = {
  // Get all FMS exercises
  getExercises: async () => {
    try {
      const response = await apiClient.get('/fms-exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching FMS exercises:', error);
      throw error;
    }
  },

  // Get exercise by ID
  getExercise: async (exerciseId) => {
    try {
      const response = await apiClient.get(`/fms-exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FMS exercise:', error);
      throw error;
    }
  }
};

// General API
export const generalAPI = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error with health check:', error);
      throw error;
    }
  }
};

export default apiClient;