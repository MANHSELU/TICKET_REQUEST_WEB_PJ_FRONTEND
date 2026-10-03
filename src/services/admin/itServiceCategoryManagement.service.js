import api from "../api.service";

export const createItServiceCategoryApi = async (data) => {
    return api.post("/api/admin/service-categories", data);
};

export const getItServiceCategoriesApi = async () => {
    return api.get("/api/admin/service-categories");
};

export const searchItServiceCategoriesApi = async (keyword) => {
    return api.get("/api/admin/service-categories/search", { params: { keyword } });
};

export const updateItServiceCategoryApi = async (categoryId, data) => {
    return api.patch(`/api/admin/service-categories/${categoryId}`, data);
};
