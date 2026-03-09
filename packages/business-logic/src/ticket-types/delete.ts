import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketType, TicketTypeSchemaMongo } from "@lytos/contracts";

export const deleteTicketType = async (
    workspaceId: string,
    typeId: string,
): Promise<{ ok: true }> => {
    const model = getModel<TicketType>(Collection.TICKET_TYPES, TicketTypeSchemaMongo);
    await model.deleteOne({ _id: typeId, workspaceId });
    return { ok: true };
};
