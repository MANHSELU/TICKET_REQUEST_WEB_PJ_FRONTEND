import api from "../api.service";

export const createTicketApi = async (data) => {
    return api.post("/api/requester/tickets", data);
};

export const getMyTicketsApi = async () => {
    return api.get("/api/requester/tickets");
};

export const getMyTicketDetailApi = async (ticketId) => {
    return api.get(`/api/requester/tickets/${ticketId}`);
};

export const getItServicesApi = async () => {
    return api.get("/api/requester/services");
};

export const getTicketCategoriesApi = async () => {
    return api.get("/api/requester/ticket-categories");
};

export const sendMessageApi = async (data) => {
    return api.post("/api/requester/messages", data);
};

export const getMessagesApi = async (ticketId) => {
    return api.get(`/api/requester/tickets/${ticketId}/messages`);
};
