import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type TicketStatus,
    TicketStatusSchemaMongo,
    type CreateTicketStatusDto,
} from "@lytos/contracts";

export const createTicketStatus = async (
    workspaceId: string,
    dto: CreateTicketStatusDto,
): Promise<TicketStatus> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<TicketStatus>(Collection.TICKET_STATUSES, TicketStatusSchemaMongo);

    const existsName = await model.findOne({ workspaceId, name: dto.name.trim() });
    if (existsName) throw new Error("NAME_TAKEN");

    if (dto.isDefault) {
        await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    }

    const status = await model.create({
        workspaceId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        isDefault: dto.isDefault ?? false,
    });

    return status.toObject();
};
