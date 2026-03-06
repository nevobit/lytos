import { Collection, getModel } from "@lytos/constant-definitions";
import { type Params, type Result, type User, UserSchemaMongo } from "@lytos/contracts";

export const getAllUsers = async ({ page = 1, limit = 10, search = '', workspaceId }: Params): Promise<Result<User>> => {
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    const skip = (page - 1) * limit;

    const users = await model
        .find({ workspaceId })
        .skip(skip)
        .limit(limit)
        .sort({ isDefault: -1, name: 1 });

    const total = await model.countDocuments({ search, workspaceId });

    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : page;

    return {
        count: total,
        items: users,
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