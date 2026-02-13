import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { CreateTicketDto, Ticket } from "@lytos/contracts";

export const createTicket = async (data: CreateTicketDto): Promise<Ticket | null> => {
    const model = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const ticket = new model({ ...data, lifecycleStatus: LifecycleStatus.ACTIVE });
    const createdTicket = await ticket.save();

    return createdTicket;
};
