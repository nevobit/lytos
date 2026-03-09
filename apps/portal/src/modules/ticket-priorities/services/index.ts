import { api } from "@/shared/api";
import type {
    TicketPriority,
    CreateTicketPripertyDto,
    Result,
} from "@lytos/contracts";

export const ticketPriorities = async (): Promise<Result<TicketPriority>> => {
    const { data } = await api.get(`/ticket-priorities`);
    return data;
};

export const createTicketPriority = async (
    priority: Partial<CreateTicketPripertyDto>,
): Promise<TicketPriority> => {
    const { data } = await api.post(`/ticket-priorities`, priority);
    return data;
};

export const updateTicketPriority = async (
    priority: Partial<TicketPriority>,
): Promise<TicketPriority> => {
    const { data } = await api.patch(`/ticket-priorities/${priority.id}`, priority);
    return data;
};

export const deleteTicketPriority = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/ticket-priorities/${id}`);
    return data;
};