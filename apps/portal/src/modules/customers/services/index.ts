import { api } from "@/shared/api";
import type { Customer, UpdateCustomerDto } from "@lytos/contracts";

export const customers = async () => {
    const { data } = await api.get(`/customers`,);
    return data;
}

export const createCustomer = async (customer: Partial<UpdateCustomerDto>) => {
    const { data } = await api.post(`/customers`, customer);
    return data;
}

export const updateCustomer = async (customer: Partial<Customer>) => {
    const { data } = await api.patch(`/customers/${customer.id}`, customer);
    return data;
}

export const deleteCustomer = async (id: string) => {
    const { data } = await api.delete(`/customers/${id}`,);
    return data;
}
