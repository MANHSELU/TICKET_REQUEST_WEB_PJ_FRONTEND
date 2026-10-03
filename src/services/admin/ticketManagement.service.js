import api from "../api.service";

export const getAllTicketsApi = async () => {
    return api.get("/api/admin/tickets");
};
