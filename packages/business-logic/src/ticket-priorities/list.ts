import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketPriority, TicketPrioritySchemaMongo, type Params, type Result } from "@lytos/contracts";

export const getAllTicketPriorities = async ({
    page = 1,
    limit = 10,
    search = '',
    workspaceId,
}: Params): Promise<Result<TicketPriority>> => {
    const model = getModel<TicketPriority>(Collection.TICKET_PRIORITIES, TicketPrioritySchemaMongo);

    const skip = (page - 1) * limit;

    const priorities = await model
        .find({ workspaceId })
        .skip(skip)
        .limit(limit)
        .sort({ isDefault: -1, level: 1, name: 1 });

    const total = await model.countDocuments({ search, workspaceId });

    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : page;

    return {
        count: total,
        items: priorities,
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
