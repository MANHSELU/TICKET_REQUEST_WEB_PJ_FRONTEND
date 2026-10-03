import api from "../api.service";

export const createSupportTeamApi = async (data) => {
    return api.post("/api/admin/support-teams", data);
};

export const getSupportTeamsApi = async () => {
    return api.get("/api/admin/support-teams");
};

export const searchSupportTeamsApi = async (keyword) => {
    return api.get("/api/admin/support-teams/search", { params: { keyword } });
};

export const updateSupportTeamApi = async (teamId, data) => {
    return api.patch(`/api/admin/support-teams/${teamId}`, data);
};
