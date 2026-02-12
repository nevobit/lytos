import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { Ticket } from "@lytos/contracts";

export const softDeleteTicket = async (id: string, workspaceId: string): Promise<Ticket | null> => {
    const model = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const deletedTicket = await model.findOneAndUpdate(
        {
            _id: id,
            workspaceId,
            lifecycleStatus: { $ne: LifecycleStatus.DELETED },
        },
        {
            lifecycleStatus: LifecycleStatus.DELETED,
            deletedAt: new Date(),
        },
        { new: true },
    );

    return deletedTicket;
};
