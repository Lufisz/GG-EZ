import axios from "axios";

axios.defaults.baseURL = "https://gg-ez-api-ce7093aa17cf.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Intercept every outgoing request to attach the JWT token for authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Proceed with the request configuration
});

// Separate instances of Axios for handling different types of requests
export const axiosReq = axios.create();
export const axiosRes = axios.create();
