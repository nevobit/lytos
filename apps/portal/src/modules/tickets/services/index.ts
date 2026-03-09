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

export const getTicketTimeline = async (
    ticketId: string,
    options?: {
        includeInternal?: boolean;
        limit?: number;
        cursorCreatedAt?: string;
        cursorId?: string;
    },
) => {
    const params: Record<string, unknown> = {};
    if (options?.includeInternal) params.includeInternal = true;
    if (options?.limit) params.limit = options.limit;
    if (options?.cursorCreatedAt) params.cursorCreatedAt = options.cursorCreatedAt;
    if (options?.cursorId) params.cursorId = options.cursorId;

    const { data } = await api.get(`/tickets/${ticketId}/timeline`, { params });
    return data as unknown[]; // timeline items
};

export const createTicketMessage = async (
    ticketId: string,
    message: { body: string; mode: "public" | "internal"; conversationId?: string },
) => {
    const { data } = await api.post(`/tickets/${ticketId}/messages`, message);
    return data;
};
