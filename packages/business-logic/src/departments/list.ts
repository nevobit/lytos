import { Collection, getModel } from "@lytos/constant-definitions";
import { Department, DepartmentSchemaMongo, Params, Result } from "@lytos/contracts";

export const getAllDepartments = async ({ page = 1, limit = 10, search = '', workspaceId }: Params): Promise<Result<Department>> => {
    const model = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const skip = (page - 1) * limit;

    const departments = await model
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
        items: departments,
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