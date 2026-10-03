import api from "../api.service";

export const createUserApi = async (data) => {
    return api.post("/api/admin/users", data);
};

export const getUsersApi = async () => {
    return api.get("/api/admin/users");
};

export const searchUsersApi = async (keyword) => {
    return api.get("/api/admin/users/search", { params: { keyword } });
};

export const updateUserStatusApi = async (userId, isActive) => {
    return api.patch(`/api/admin/users/${userId}/status`, { isActive });
};
