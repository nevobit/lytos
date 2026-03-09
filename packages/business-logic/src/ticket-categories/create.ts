import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type TicketCategory,
    TicketCategorySchemaMongo,
    type CreateTicketCategoryDto,
} from "@lytos/contracts";

export const createTicketCategory = async (
    workspaceId: string,
    dto: CreateTicketCategoryDto,
): Promise<TicketCategory> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<TicketCategory>(Collection.TICKET_CATEGORIES, TicketCategorySchemaMongo);

    // ensure unique name within workspace
    const existsName = await model.findOne({ workspaceId, name: dto.name.trim() });
    if (existsName) throw new Error("NAME_TAKEN");

    // if this should be default, unset previous defaults
    if (dto.isDefault) {
        await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    }

    const category = await model.create({
        workspaceId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        isDefault: dto.isDefault ?? false,
    });

    return category.toObject();
};