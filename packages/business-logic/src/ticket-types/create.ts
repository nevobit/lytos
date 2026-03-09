import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type TicketType,
    TicketTypeSchemaMongo,
    type CreateTicketTypeDto,
} from "@lytos/contracts";

export const createTicketType = async (
    workspaceId: string,
    dto: CreateTicketTypeDto,
): Promise<TicketType> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<TicketType>(Collection.TICKET_TYPES, TicketTypeSchemaMongo);

    // ensure unique name within workspace
    const existsName = await model.findOne({ workspaceId, name: dto.name.trim() });
    if (existsName) throw new Error("NAME_TAKEN");

    // if this should be default, unset previous defaults
    if (dto.isDefault) {
        await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    }

    const type = await model.create({
        workspaceId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        isDefault: dto.isDefault ?? false,
    });

    return type.toObject();
};
