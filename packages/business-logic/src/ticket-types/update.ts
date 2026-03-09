import { Collection, getModel } from "@lytos/constant-definitions";
import {
    TicketTypeSchemaMongo,
    type TicketType,
    type UpdateTicketTypeDto,
} from "@lytos/contracts";

export const updateTicketType = async (
    workspaceId: string,
    typeId: string,
    dto: UpdateTicketTypeDto,
): Promise<TicketType | null> => {
    const model = getModel<TicketType>(Collection.TICKET_TYPES, TicketTypeSchemaMongo);

    const existing = await model.findOne({ _id: typeId, workspaceId }).lean();
    if (!existing) throw new Error("NOT_FOUND");

    const update: Partial<TicketType> = {};

    if (dto.name !== undefined) {
        const name = dto.name.trim();
        if (name) {
            const dup = await model.findOne({ workspaceId, name, _id: { $ne: typeId } });
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

    await model.updateOne({ _id: typeId, workspaceId }, { $set: update });
    return model.findOne({ _id: typeId, workspaceId });
};
