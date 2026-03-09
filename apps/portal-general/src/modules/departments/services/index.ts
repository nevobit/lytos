import { api } from "@/shared/api";
import type { Department, UpdateDepartmentDto } from "@lytos/contracts";

export const departments = async () => {
    const { data } = await api.get(`/departments`,);
    return data;
}

export const createDepartment = async (department: UpdateDepartmentDto) => {
    const { data } = await api.post(`/departments`, department);
    return data;
}

export const updateDepartment = async (department: Partial<Department>) => {
    const { data } = await api.patch(`/departments/${department.id}`, department);
    return data;
}

export const deleteDepartment = async (id: string) => {
    const { data } = await api.delete(`/departments/${id}`,);
    return data;
}
