import axios from "../axios";
import { QueryClient } from "react-query";

export const BASE_URL = 'https://13.59.254.151:5000'
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
