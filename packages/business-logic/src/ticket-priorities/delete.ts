import { Collection, getModel } from "@lytos/constant-definitions";
import { TicketPrioritySchemaMongo, type TicketPriority } from "@lytos/contracts";

export const deleteTicketPriority = async (
    workspaceId: string,
    priorityId: string,
) => {
    const model = getModel<TicketPriority>(Collection.TICKET_PRIORITIES, TicketPrioritySchemaMongo);

    const priority = await model.findOne({ _id: priorityId, workspaceId });
    if (!priority) throw new Error("NOT_FOUND");
    if (priority.isDefault) throw new Error("CANNOT_DELETE_DEFAULT");

    await model.deleteOne({ _id: priorityId, workspaceId });

    return { ok: true };
};
