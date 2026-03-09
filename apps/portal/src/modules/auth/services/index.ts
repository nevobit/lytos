import { api } from "@/shared/api";
import type { CreateWorkspaceDto } from "@lytos/contracts";

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

export const loginGoogle = async (credential: string) => {
    const { data } = await api.post(`/auth/login/google`, { credential });
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

export const users = async () => {
    const { data } = await api.get(`/users`,);
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

export const inviteUser = async (payload: { email: string; roleId?: string }) => {
    const { data } = await api.post(`/invitations`, payload);
    return data;
};

export const fetchInvitations = async () => {
    const { data } = await api.get(`/invitations`);
    return data;
};

export const revokeInvitation = async (id: string) => {
    const { data } = await api.delete(`/invitations/${id}`);
    return data;
};


export const deleteWorkspace = async (id: string) => {
    const { data } = await api.delete(`/workspaces/${id}`,);
    return data;
}

