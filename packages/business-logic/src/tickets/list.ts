import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { Params, Result, Ticket } from "@lytos/contracts";

export const listTickets = async ({
    page = 1,
    limit = 10,
    search = "",
    workspaceId,
}: Params): Promise<Result<Ticket>> => {
    const model = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
        workspaceId,
        lifecycleStatus: { $ne: LifecycleStatus.DELETED },
    };

    if (search.trim()) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
            { ticketNumber: { $regex: search, $options: "i" } },
        ];
    }

    const tickets = await model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await model.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
        count: total,
        items: tickets,
        pageInfo: {
            kind: "offset",
            page,
            pages,
            hasPreviousPage,
            hasNextPage,
            previousPage,
            nextPage,
        },
    };
};
