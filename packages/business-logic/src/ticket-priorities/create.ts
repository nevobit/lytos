import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type TicketPriority,
    TicketPrioritySchemaMongo,
    type CreateTicketPripertyDto,
} from "@lytos/contracts";

export const createTicketPriority = async (
    workspaceId: string,
    dto: CreateTicketPripertyDto,
): Promise<TicketPriority> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");
    if (typeof dto.level !== "number") throw new Error("BAD_REQUEST");

    const model = getModel<TicketPriority>(Collection.TICKET_PRIORITIES, TicketPrioritySchemaMongo);

    // ensure unique name and level within workspace
    const existsName = await model.findOne({ workspaceId, name: dto.name.trim() });
    if (existsName) throw new Error("NAME_TAKEN");
    const existsLevel = await model.findOne({ workspaceId, level: dto.level });
    if (existsLevel) throw new Error("LEVEL_TAKEN");

    // if this priority should be default, unset previous defaults
    if (dto.isDefault) {
        await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    }

    const priority = await model.create({
        workspaceId,
        name: dto.name.trim(),
        level: dto.level,
        color: dto.color?.trim(),
        isDefault: dto.isDefault ?? false,
    });

    return priority.toObject();
};
