import api from "../api.service";

export const getProfileApi = async () => {
    return api.get("/api/common/profile");
};

export const updateProfileApi = async (formData) => {
    return api.patch("/api/common/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const changePasswordApi = async (data) => {
    return api.patch("/api/common/changePass", data);
};
