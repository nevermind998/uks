import axios, { AxiosInstance } from "axios";

let BASE_URL = "";
if (process.env.REACT_APP_ENV === 'development')
  BASE_URL = 'http://localhost:8000/api'
else
  BASE_URL = 'http://localhost/api'

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  config => {
    if (localStorage.getItem("access_token")) config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) window.location.href = "/sign-in";

    return Promise.reject(error);
  }
);
