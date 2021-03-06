const { default: axiosClient } = require("./axiosClient");

const qrcodeApi = {
    getById: (id) => {
        const url = `/qrcode/${id}`;
        return axiosClient.get(url, {id});
    },
    getByUserId: (id) => {
        const url = `/qrcode/user/${id}`;
        return axiosClient.get(url, {id});
    },
    getByTeacherId: (id) => {
        const url = `/qrcode/teacher/${id}`;
        return axiosClient.get(url, {id});
    },
    getByClassId: (id) => {
        const url = `/qrcode/class/${id}`;
        return axiosClient.get(url, {id});
    },
    getSubjects: (id) => {
        const url = `/qrcode/class/${id}/subjects`;
        return axiosClient.get(url, {id})
    },
    createOne: (body) => {
        const url = '/qrcode/create';
        return axiosClient.post(url, body);
    },
    sendMail: (body) => {
        const url = '/qrcode/send-mail';
        return axiosClient.post(url, body);
    },
    updateById: (id) => {
        const url = `/qrcode/${id}`;
        return axiosClient.patch(url, {id});
    },
    updateExp: (id, body) => {
        const url = `/qrcode/exp/${id}`;
        return axiosClient.patch(url, body);
    }
}

export default qrcodeApi;