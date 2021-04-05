import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    // baseURL:  'http://192.168.1.17:8585/api' || 'http://192.168.1.16:8585/api' ,
    baseURL: 'http://4e2754dd4c9f.ngrok.io/api',
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
