import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/forms'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const submitContactForm = (payload) => api.post('/contact', payload)
export const submitEnrollmentForm = (payload) => api.post('/enroll', payload)
export const submitWorkshopForm = (payload) => api.post('/workshop', payload)
