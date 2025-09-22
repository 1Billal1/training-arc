import axios from 'axios';

// 1. Get the backend URL from the environment variable
const API_URL = import.meta.env.VITE_API_URL;

// 2. Create a new Axios instance with a pre-configured baseURL
const apiClient = axios.create({
  baseURL: API_URL
});

// 3. Export the instance so you can use it in your components
export default apiClient;