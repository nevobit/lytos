import { Collection, getModel } from "@lytos/constant-definitions";
import { type TicketType, TicketTypeSchemaMongo, type Params, type Result } from "@lytos/contracts";

export const getAllTicketTypes = async ({
    page = 1,
    limit = 10,
    search = '',
    workspaceId,
}: Params): Promise<Result<TicketType>> => {
    const model = getModel<TicketType>(Collection.TICKET_TYPES, TicketTypeSchemaMongo);

    const skip = (page - 1) * limit;

    const query: { name?: { $regex: string, $options: string }, workspaceId: string } = { workspaceId };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const types = await model
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
        items: types,
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
