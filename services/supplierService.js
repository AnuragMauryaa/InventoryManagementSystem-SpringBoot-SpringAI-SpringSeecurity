import api from "./api";

const BASE = "/suppliers";

export default {

    getAll: async () => (await api.get(BASE)).data,

    create: async (supplier) =>
        (await api.post(BASE, supplier)).data,

    update: async (id, supplier) =>
        (await api.put(`${BASE}/${id}`, supplier)).data,

    delete: async (id) =>
        await api.delete(`${BASE}/${id}`),

};
