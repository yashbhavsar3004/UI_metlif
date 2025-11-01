import axios from "axios";

// Create axios instance with base configuration
// Note: Vite uses import.meta.env instead of process.env
// Environment variables must be prefixed with VITE_
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://rapacious-tammi-unfeudally.ngrok-free.dev",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens or other headers
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// API service functions
export const claimFormAPI = {
  // Submit manual claim form
  submitClaimForm: async (formData) => {
    try {
      const response = await api.post("/api/claims", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload PDF claim form
  uploadPDFForm: async (pdfFile) => {
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await api.post("/extract-claim", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all claims (for admin dashboard)
  getAllClaims: async () => {
    try {
      const response = await api.get("/api/claims");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get claim by ID
  getClaimById: async (claimId) => {
    try {
      const response = await api.get(`/api/claims/${claimId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
