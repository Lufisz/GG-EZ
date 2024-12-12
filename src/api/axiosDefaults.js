import axios from "axios";

axios.defaults.baseURL = "https://gg-ez-api-ce7093aa17cf.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;