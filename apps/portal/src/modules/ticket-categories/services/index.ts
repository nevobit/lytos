import { api } from "@/shared/api";
import type { TicketCategory, CreateTicketCategoryDto, Result } from "@lytos/contracts";

export const ticketCategories = async (): Promise<Result<TicketCategory>> => {
    const { data } = await api.get(`/ticket-categories`);
    return data;
};

export const createTicketCategory = async (
    cat: Partial<CreateTicketCategoryDto>,
): Promise<TicketCategory> => {
    const { data } = await api.post(`/ticket-categories`, cat);
    return data;
};

export const updateTicketCategory = async (
    cat: Partial<TicketCategory>,
): Promise<TicketCategory> => {
    const { data } = await api.patch(`/ticket-categories/${cat.id}`, cat);
    return data;
};

export const deleteTicketCategory = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/ticket-categories/${id}`);
    return data;
};