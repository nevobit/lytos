import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { Ticket } from "@lytos/contracts";

export const findTicketById = async (id: string, workspaceId: string): Promise<Ticket | null> => {
    const model = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const ticket = await model.findOne({
        _id: id,
        workspaceId,
        lifecycleStatus: { $ne: LifecycleStatus.DELETED },
    });

    return ticket;
};
