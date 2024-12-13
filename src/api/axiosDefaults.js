import axios from "axios";

axios.defaults.baseURL = "https://8000-dimmanzo-ggezapi-rjnpmkx5aay.ws.codeinstitute-ide.net/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

export const axiosReq = axios.create();
export const axiosRes = axios.create();
