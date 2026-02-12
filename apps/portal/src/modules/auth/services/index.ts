import { api } from "../../../shared/api";

interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await api.post(`/auth/login`, payload);
    return data;
}


export const workspaces = async () => {
    const { data } = await api.get(`/workspaces`,);
    return data;
}

export const switchWorkspace = async (membershipId: string) => {
    const { data } = await api.post(`/auth/switch-workspace`, { membershipId });
    return data;
}
