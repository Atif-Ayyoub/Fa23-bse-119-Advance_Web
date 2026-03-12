import axios from 'axios';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = configuredApiBaseUrl || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const extractErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;
