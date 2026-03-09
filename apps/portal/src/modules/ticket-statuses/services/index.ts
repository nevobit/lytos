import { api } from "@/shared/api";
import type { TicketStatus, CreateTicketStatusDto, Result } from "@lytos/contracts";

export const ticketStatuses = async (): Promise<Result<TicketStatus>> => {
    const { data } = await api.get(`/ticket-statuses`);
    return data;
};

export const createTicketStatus = async (
    status: Partial<CreateTicketStatusDto>,
): Promise<TicketStatus> => {
    const { data } = await api.post(`/ticket-statuses`, status);
    return data;
};

export const updateTicketStatus = async (
    status: Partial<TicketStatus>,
): Promise<TicketStatus> => {
    const { data } = await api.patch(`/ticket-statuses/${status.id}`, status);
    return data;
};

export const deleteTicketStatus = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/ticket-statuses/${id}`);
    return data;
};
