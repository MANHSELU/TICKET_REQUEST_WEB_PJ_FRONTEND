import api from "../api.service";

export const createItServiceApi = async (data) => {
    return api.post("/api/admin/services", data);
};

export const getItServicesApi = async () => {
    return api.get("/api/admin/services");
};

export const searchItServicesApi = async (keyword) => {
    return api.get("/api/admin/services/search", { params: { keyword } });
};

export const updateItServiceApi = async (serviceId, data) => {
    return api.patch(`/api/admin/services/${serviceId}`, data);
};
