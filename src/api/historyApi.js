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
    getDetail: (idUser, idSubject) => {
        const url = `/history/detail?userID=${idUser}&subjectID=${idSubject}`;
        return axiosClient.get(url, {idUser, idSubject});
    },
    createOne: (body) => {
        const url = '/history/create';
        return axiosClient.post(url, body);
    }
}

export default historyApi;