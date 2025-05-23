import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Axios instance με βάση URL και timeout
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 5000,
});

// Interceptor για να στέλνουμε αυτόματα το JWT token σε κάθε αίτημα
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
