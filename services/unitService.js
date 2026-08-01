import api from "./api";

export const getAllUnits = async () => {
    const response = await api.get("/units");
    return response.data;
};
