import { api } from "@/shared/api";

export const customers = async () => {
    const { data } = await api.get(`/customers`,);
    return data;
}
