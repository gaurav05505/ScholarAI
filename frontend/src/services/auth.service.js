import axios from 'axios'

const getApiHost = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost'
  return `http://${hostname}:5000`
}

export const API_BASE_URL = `${getApiHost()}/auth/user`

export const registerUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/me`)
  return response.data
}

