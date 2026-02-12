import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { Ticket, UpdateTicketDto } from "@lytos/contracts";

export const updateTicket = async (
    id: string,
    workspaceId: string,
    data: UpdateTicketDto,
): Promise<Ticket | null> => {
    const model = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const updatedTicket = await model.findOneAndUpdate(
        {
            _id: id,
            workspaceId,
            lifecycleStatus: { $ne: LifecycleStatus.DELETED },
        },
        data,
        { new: true },
    );

    return updatedTicket;
};
