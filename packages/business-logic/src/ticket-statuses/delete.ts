import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketStatus, TicketStatusSchemaMongo } from "@lytos/contracts";

export const deleteTicketStatus = async (workspaceId: string, statusId: string): Promise<{ ok: true }> => {
    const model = getModel<TicketStatus>(Collection.TICKET_STATUSES, TicketStatusSchemaMongo);
    await model.deleteOne({ _id: statusId, workspaceId });
    return { ok: true };
};
