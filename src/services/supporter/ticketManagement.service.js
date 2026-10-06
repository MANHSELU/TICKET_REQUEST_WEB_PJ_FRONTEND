import api from "../api.service";

export const getAllTicketsApi = async () => {
    return api.get("/api/supporter/tickets");
};

export const getMyClosedTicketsApi = async () => {
    return api.get("/api/supporter/tickets/closed");
};

export const getTicketDetailApi = async (ticketId) => {
    return api.get(`/api/supporter/tickets/${ticketId}`);
};

export const acceptTicketApi = async (ticketId) => {
    return api.patch(`/api/supporter/tickets/${ticketId}/accept`);
};

export const closeTicketApi = async (ticketId) => {
    return api.patch(`/api/supporter/tickets/${ticketId}/close`);
};

export const sendMessageApi = async (data) => {
    return api.post("/api/supporter/messages", data);
};

export const getMessagesApi = async (ticketId) => {
    return api.get(`/api/supporter/tickets/${ticketId}/messages`);
};
