import api from "../api.service";

export const createAnnouncementApi = async (formData) => {
    return api.post("/api/supporter/announcements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getAllAnnouncementsApi = async () => {
    return api.get("/api/supporter/announcements");
};

export const getMyAnnouncementsApi = async () => {
    return api.get("/api/supporter/announcements/mine");
};
