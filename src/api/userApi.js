const { default: axiosClient } = require("./axiosClient");

const userApi = {
    getAll: (params) => {
        const url = '/users';
        return axiosClient.get(url, {params});
    },
    getByClasses: (body) => {
        const url = '/users/classes';
        return axiosClient.post(url, body);
    },
    getDetail: (token) => {
        const url = '/users/me';
        return axiosClient.get(url, {
            headers: {
                'content-type': "application/json",
                'token': token
            }
        })
    },
    updatePassword: (id, body) => {
        const url = `/users/password/${id}`;
        return axiosClient.post(url, body);
    }
}

export default userApi;