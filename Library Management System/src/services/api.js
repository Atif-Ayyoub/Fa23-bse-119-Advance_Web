import axios from 'axios';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const runtimeHostname = typeof window === 'undefined' ? 'localhost' : window.location.hostname;
const defaultDevApiBaseUrl = `http://${runtimeHostname}:5000/api`;
const API_BASE_URL = configuredApiBaseUrl || (import.meta.env.PROD ? '/api' : defaultDevApiBaseUrl);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const extractErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;
