import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketCategory, TicketCategorySchemaMongo } from "@lytos/contracts";

export const deleteTicketCategory = async (
    workspaceId: string,
    categoryId: string,
): Promise<{ ok: true }> => {
    const model = getModel<TicketCategory>(Collection.TICKET_CATEGORIES, TicketCategorySchemaMongo);
    await model.deleteOne({ _id: categoryId, workspaceId });
    return { ok: true };
};