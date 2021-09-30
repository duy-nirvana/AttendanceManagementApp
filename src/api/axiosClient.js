import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL:  ' http://3c16-2001-ee0-4f83-e390-4ccb-11fd-580a-1d14.ngrok.io/api' || 'http://192.168.1.21/api',
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
