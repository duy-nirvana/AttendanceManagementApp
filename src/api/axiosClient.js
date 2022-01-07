import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: 'http://27a3-2001-ee0-4f83-cff0-8713-d1b3-a9b4-bd2e.ngrok.io/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
    },
    paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(async (config) => {
    // Handle token here ...
    return config;
})

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});

export default axiosClient;
