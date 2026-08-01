import api from "./api";

const BASE = "/customers";

export default {

    getAll: async () => (await api.get(BASE)).data,

    create: async (customer) =>
        (await api.post(BASE, customer)).data,

    update: async (id, customer) =>
        (await api.put(`${BASE}/${id}`, customer)).data,

    delete: async (id) =>
        await api.delete(`${BASE}/${id}`),

};
