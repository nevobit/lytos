import { api } from "@/shared/api";
import type { Ticket, UpdateTicketDto } from "@lytos/contracts";

export const tickets = async () => {
    const { data } = await api.get(`/tickets`,);
    return data;
}

export const createTicket = async (ticket: UpdateTicketDto) => {
    const { data } = await api.post(`/tickets`, ticket);
    return data;
}

export const updateTicket = async (ticket: Partial<Ticket>) => {
    const { data } = await api.patch(`/tickets/${ticket.id}`, ticket);
    return data;
}

export const deleteTicket = async (id: string) => {
    const { data } = await api.delete(`/tickets/${id}`,);
    return data;
}
