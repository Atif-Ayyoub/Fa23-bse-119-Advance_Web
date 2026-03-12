import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

export const extractErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;
