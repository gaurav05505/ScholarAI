import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/auth/user'

export const registerUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data)
  return response.data
}