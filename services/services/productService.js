import api from "./api";

const BASE = "/products";

const getAll = async () => {
    const response = await api.get(BASE);
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
};

const create = async (product) => {
    const response = await api.post(BASE, product);
    return response.data;
};

const update = async (id, product) => {
    const response = await api.put(`${BASE}/${id}`, product);
    return response.data;
};

const remove = async (id) => {
    await api.delete(`${BASE}/${id}`);
};

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};
