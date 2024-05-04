import axios from "../axios";
import { QueryClient } from "react-query";

const PROD_URL = 'https://13.59.254.151';

const DEV_URL =  'http://localhost:5000';

const IS_DEV_ENV = !process.env.NODE_ENV 
    || process.env.NODE_ENV === 'development';

export const BASE_URL = IS_DEV_ENV ? DEV_URL : PROD_URL;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey: [url] }) => {
                if (typeof url === 'string') {
                    const { data } = await axios.get(`${BASE_URL}/${url.toLowerCase()}`)
                    return data
                }
                throw new Error('Invalid QueryKey')
            },
        },
    },
});
