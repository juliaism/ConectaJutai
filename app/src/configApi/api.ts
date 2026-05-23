import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://conectajutai.onrender.com:3000';

const api = axios.create({
  baseURL: apiUrl,
});

export default api;