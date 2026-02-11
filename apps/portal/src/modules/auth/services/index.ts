import { api } from "../../../shared/api";

interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await api.post(`/auth/login`, payload);
    return data;
}
