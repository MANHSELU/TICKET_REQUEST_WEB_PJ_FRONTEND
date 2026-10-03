import api from "../api.service";

export const createTicketCategoryApi = async (data) => {
    return api.post("/api/admin/ticket-categories", data);
};

export const getTicketCategoriesApi = async () => {
    return api.get("/api/admin/ticket-categories");
};

export const searchTicketCategoriesApi = async (keyword) => {
    return api.get("/api/admin/ticket-categories/search", { params: { keyword } });
};

export const updateTicketCategoryApi = async (categoryId, data) => {
    return api.patch(`/api/admin/ticket-categories/${categoryId}`, data);
};
