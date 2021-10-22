const { default: axiosClient } = require("./axiosClient");

const historyApi = {
    getAll: () => {
        const url = '/history';
        return axiosClient.get(url)
    },
    getUser: (id) => {
        const url = `/history/user/${id}`;
        return axiosClient.get(url, {id});
    },
    getQRCodes: (id) => {
        const url = `/history/qrcode/${id}`;
        return axiosClient.get(url, {id});
    },
    getSubjects: (id) => {
        const url = `/history/user/${id}/attendanced`;
        return axiosClient.get(url, {id});
    },
    getDetail: (body) => {
        const url = `/history/detail`;
        return axiosClient.post(url, body);
    },
    createOne: (body) => {
        const url = '/history/create';
        return axiosClient.post(url, body);
    }
}

export default historyApi;