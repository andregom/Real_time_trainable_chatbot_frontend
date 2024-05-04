import axios from 'axios';

const PROD_URL = 'https://13.59.254.151';

const DEV_URL =  'http://localhost:5000';

const IS_DEV_ENV = !process.env.NODE_ENV 
    || process.env.NODE_ENV === 'development';

export const BASE_URL = IS_DEV_ENV ? DEV_URL : PROD_URL;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false
});