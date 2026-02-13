import { api } from "@/shared/api";

export const tickets = async () => {
    const { data } = await api.get(`/tickets`,);
    return data;
}
