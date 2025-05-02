import axios from "axios";
import { getErrorMessage } from "../utils/errorHandling";

const axiosInstance = axios.create({
  baseURL: "https://autogen.aieducator.com/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Increased to 60 seconds for file uploads
});

// Request Interceptor - Adds Authorization Token and handles file uploads
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Handle FormData content type for file uploads
    if (config.data instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handles Errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle timeout errors specifically
    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout Error");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    // Handle authentication errors (401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");

      // Redirect to login page
      window.location.href = "/login";
      return Promise.reject(
        new Error("Your session has expired. Please log in again.")
      );
    }

    // For other errors, return a user-friendly message
    const errorMessage = getErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  }
);

// Custom method for file uploads with extended timeout
axiosInstance.uploadFile = async (url, formData, progressCallback) => {
  try {
    const response = await axiosInstance.post(url, formData, {
      timeout: 120000, // 2 minutes for file uploads
      headers: {
        // Don't set Content-Type, axios will set it with the correct boundary
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressCallback(percentCompleted);
        }
      },
    });
    return response;
  } catch (error) {
    // Create a more user-friendly error message for file uploads
    if (error.code === "ECONNABORTED") {
      error.friendlyMessage =
        "Upload timed out. Please try with a smaller image or check your connection.";
    } else if (error.response?.status === 413) {
      error.friendlyMessage = "File too large. Please upload a smaller image.";
    } else {
      error.friendlyMessage = "Error uploading file. Please try again.";
    }
    throw error;
  }
};

export default axiosInstance;
