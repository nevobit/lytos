import { Collection, getModel } from "@lytos/constant-definitions";
import {
    TicketCategorySchemaMongo,
    type TicketCategory,
    type UpdateTicketCategoryDto,
} from "@lytos/contracts";

export const updateTicketCategory = async (
    workspaceId: string,
    categoryId: string,
    dto: UpdateTicketCategoryDto,
): Promise<TicketCategory | null> => {
    const model = getModel<TicketCategory>(Collection.TICKET_CATEGORIES, TicketCategorySchemaMongo);

    const existing = await model.findOne({ _id: categoryId, workspaceId }).lean();
    if (!existing) throw new Error("NOT_FOUND");

    const update: Partial<TicketCategory> = {};

    if (dto.name !== undefined) {
        const name = dto.name.trim();
        if (name) {
            const dup = await model.findOne({ workspaceId, name, _id: { $ne: categoryId } });
            if (dup) throw new Error("NAME_TAKEN");
            update.name = name;
        } else {
            throw new Error("BAD_REQUEST");
        }
    }

    if (dto.description !== undefined) {
        update.description = dto.description?.trim();
    }

    if (dto.isDefault !== undefined) {
        if (dto.isDefault) {
            await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
        }
        update.isDefault = dto.isDefault;
    }

    await model.updateOne({ _id: categoryId, workspaceId }, { $set: update });
    return model.findOne({ _id: categoryId, workspaceId });
};