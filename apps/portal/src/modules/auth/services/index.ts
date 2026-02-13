import type { CreateWorkspaceDto } from "@lytos/contracts";
import { api } from "../../../shared/api";

interface LoginPayload {
    email: string;
    password: string;
}

interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await api.post(`/auth/login`, payload);
    return data;
}

export const signup = async (payload: SignupPayload) => {
    const { data } = await api.post(`/auth/signup`, payload);
    return data;
}

export const workspaces = async () => {
    const { data } = await api.get(`/workspaces`,);
    return data;
}

export const switchWorkspace = async ({ membershipId, workspaceId }: { membershipId: string, workspaceId: string }) => {
    const { data } = await api.post(`/auth/switch-workspace`, { membershipId, workspaceId });
    return data;
}

export const createWorkspace = async (input: CreateWorkspaceDto) => {
    const { data } = await api.post(`/workspaces`, input);
    return data;
}
