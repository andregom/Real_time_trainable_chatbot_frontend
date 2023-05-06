import { axiosPrivate } from "../api/axios";
import { QueryClient } from "react-query";

export const BASE_URL = 'http://localhost:5000';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey: [url] }) => {
                if (typeof url === 'string') {
                    const { data } = await axiosPrivate.get(`${BASE_URL}/${url.toLowerCase()}`)
                    return data
                }
                throw new Error('Invalid QueryKey')
            },
        },
    },
});