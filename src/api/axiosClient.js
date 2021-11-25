import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: 'http://d1e3-2001-ee0-4fc2-4620-505d-cb91-5146-e4ca.ngrok.io/api',
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
