import axios from 'axios';

const getApiHost = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname =
    typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'localhost';

  return `http://${hostname}:5000`;
};

const API_URL = getApiHost();

export const createSubscription = async (plan, token) => {
  const response = await axios.post(
    `${API_URL}/api/subscription/create`,
    { plan },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};