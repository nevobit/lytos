import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type TicketStatus,
    TicketStatusSchemaMongo,
    type UpdateTicketStatusDto,
} from "@lytos/contracts";

export const updateTicketStatus = async (
    workspaceId: string,
    statusId: string,
    dto: UpdateTicketStatusDto,
): Promise<TicketStatus | null> => {
    if (dto.name && !dto.name.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<TicketStatus>(Collection.TICKET_STATUSES, TicketStatusSchemaMongo);

    if (dto.name) {
        const exists = await model.findOne({ workspaceId, name: dto.name.trim(), _id: { $ne: statusId } });
        if (exists) throw new Error("NAME_TAKEN");
    }

    if (dto.isDefault) {
        await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    }

    const updated = await model.findByIdAndUpdate(statusId, dto, { new: true });
    return updated?.toObject() || null;
};
