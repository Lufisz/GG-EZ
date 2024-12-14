import axios from "axios";

axios.defaults.baseURL = "https://8000-dimmanzo-ggezapi-rjnpmkx5aay.ws.codeinstitute-ide.net/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const axiosReq = axios.create();
export const axiosRes = axios.create();
