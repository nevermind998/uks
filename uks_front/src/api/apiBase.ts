import axios, { AxiosInstance } from 'axios';

export const BASE_URL = 'http://localhost:8000';
export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

const token = localStorage.getItem('access_token');

api.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
