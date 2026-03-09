import { api } from "@/shared/api";
import type { Role, CreateRoleDto, Result } from "@lytos/contracts";

export const roles = async (): Promise<Result<Role>> => {
    const { data } = await api.get(`/roles`);
    return data;
};

export const createRole = async (
    role: Partial<CreateRoleDto>,
): Promise<Role> => {
    const { data } = await api.post(`/roles`, role);
    return data;
};

export const updateRole = async (
    role: Partial<Role>,
): Promise<Role> => {
    const { data } = await api.patch(`/roles/${role.id}`, role);
    return data;
};

export const deleteRole = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/roles/${id}`);
    return data;
};
