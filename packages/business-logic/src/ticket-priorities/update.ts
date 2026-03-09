import { Collection, getModel } from "@lytos/constant-definitions";
import {
    TicketPrioritySchemaMongo,
    type TicketPriority,
    type UpdateTicketPripertyDto,
} from "@lytos/contracts";

export const updateTicketPriority = async (
    workspaceId: string,
    priorityId: string,
    dto: UpdateTicketPripertyDto,
): Promise<TicketPriority | null> => {
    const model = getModel<TicketPriority>(Collection.TICKET_PRIORITIES, TicketPrioritySchemaMongo);

    const existing = await model.findOne({ _id: priorityId, workspaceId }).lean();
    if (!existing) throw new Error("NOT_FOUND");

    const update: Partial<TicketPriority> = {};

    if (dto.name !== undefined) {
        const name = dto.name.trim();
        if (name) {
            const dup = await model.findOne({ workspaceId, name, _id: { $ne: priorityId } });
            if (dup) throw new Error("NAME_TAKEN");
            update.name = name;
        } else {
            throw new Error("BAD_REQUEST");
        }
    }

    if (dto.level !== undefined) {
        const dup = await model.findOne({ workspaceId, level: dto.level, _id: { $ne: priorityId } });
        if (dup) throw new Error("LEVEL_TAKEN");
        update.level = dto.level;
    }

    if (dto.color !== undefined) {
        update.color = dto.color?.trim();
    }

    if (dto.isDefault !== undefined) {
        if (dto.isDefault) {
            // unset other defaults
            await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
        }
        update.isDefault = dto.isDefault;
    }

    await model.updateOne({ _id: priorityId, workspaceId }, { $set: update });

    return model.findOne({ _id: priorityId, workspaceId });
};
