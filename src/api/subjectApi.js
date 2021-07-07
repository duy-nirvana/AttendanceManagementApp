const { default: axiosClient } = require("./axiosClient");

const subjectApi = {
    getAll: () => {
        const url = '/subjects';
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `/subjects/${id}`;
        return axiosClient.get(url, {id});
    },
    findOne: (searchString) => {
        const url = `/subjects/search?subject=${searchString}`;
        return axiosClient.get(url);
    }
}

export default subjectApi;