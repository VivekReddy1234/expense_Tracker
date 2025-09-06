import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  headers: {    
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {  
    return Promise.reject(error);
  }
);

axiosInstance.defaults.withCredentials = true;



axiosInstance.interceptors.response.use(
  (response) => {   
    return response;
    },
  (error) => {  
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.warn('Unauthorized! Redirecting to login...');
        window.location.href = '/login'; // Uncomment to enable redirection
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  } 
);


export default axiosInstance;