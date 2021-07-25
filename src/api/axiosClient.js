import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL:  'http://cb9ae62df84a.ngrok.io/api' || 'http://192.168.1.21/api',
    headers: {
        'content-type': "application/json"
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
