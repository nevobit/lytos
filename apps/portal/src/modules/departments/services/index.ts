import { api } from "@/shared/api";

export const departments = async () => {
    const { data } = await api.get(`/departments`,);
    return data;
}
