import api from "../api.service";

export const registerApi = async (data) => {
    return api.post("/api/auth/register", data);
};

export const verifyOtpApi = async (data) => {
    return api.patch("/api/auth/verify", data);
};

export const resendOtpApi = async (data) => {
    return api.post("/api/auth/sendOtp", data);
};

export const loginApi = async (data) => {
    return api.post("/api/auth/login", data);
};