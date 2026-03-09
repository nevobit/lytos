import { api } from "@/shared/api";
import type { TicketType, CreateTicketTypeDto, Result } from "@lytos/contracts";

export const ticketTypes = async (): Promise<Result<TicketType>> => {
    const { data } = await api.get(`/ticket-types`);
    return data;
};

export const createTicketType = async (
    cat: CreateTicketTypeDto,
): Promise<TicketType> => {
    const { data } = await api.post(`/ticket-types`, cat);
    return data;
};

export const updateTicketType = async (
    cat: TicketType,
): Promise<TicketType> => {
    const { data } = await api.patch(`/ticket-types/${cat.id}`, cat);
    return data;
};

export const deleteTicketType = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/ticket-types/${id}`);
    return data;
};
