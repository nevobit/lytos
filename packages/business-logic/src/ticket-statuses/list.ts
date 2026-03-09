import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketStatus, TicketStatusSchemaMongo, type Params, type Result } from "@lytos/contracts";

export const getAllTicketStatuses = async ({
    page = 1,
    limit = 10,
    search = '',
    workspaceId,
}: Params): Promise<Result<TicketStatus>> => {
    const model = getModel<TicketStatus>(Collection.TICKET_STATUSES, TicketStatusSchemaMongo);

    const skip = (page - 1) * limit;

    const query: { name?: { $regex: string, $options: string }, workspaceId: string } = { workspaceId };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const statuses = await model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ isDefault: -1, name: 1 });

    const total = await model.countDocuments(query);

    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : page;

    return {
        count: total,
        items: statuses,
        pageInfo: {
            kind: 'offset',
            page,
            pages,
            hasPreviousPage,
            hasNextPage,
            previousPage,
            nextPage,
        },
    };
};
