import axios from "axios";

const API_URL = "https://192.168.86.40:3000"; //ip

export const signup = async (phone: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { phone, password });
  return response.data;
};

export const login = async (phone: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
  return response.data;
};

export const resetPassword = async (phone: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    phone,
    newPassword,
  });
  return response.data;
};
