import axios from 'axios';

export const BASE_URL = 'https://13.59.254.151:5000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false
});