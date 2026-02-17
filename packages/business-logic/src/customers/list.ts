import { Collection, getModel } from "@lytos/constant-definitions";
import { type Customer, CustomerSchemaMongo, type Params, type Result } from "@lytos/contracts";

export const getAllCustomers = async ({ page = 1, limit = 10, search = '', workspaceId }: Params): Promise<Result<Customer>> => {
    const model = getModel<Customer>(Collection.CUSTOMERS, CustomerSchemaMongo);

    const skip = (page - 1) * limit;

    const customers = await model
        .find({ workspaceId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await model.countDocuments({ search, workspaceId });

    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : page;

    return {
        count: total,
        items: customers,
        pageInfo: {
            kind: 'offset',
            page,
            pages,
            hasPreviousPage,
            hasNextPage,
            previousPage, nextPage

        }
    }
}