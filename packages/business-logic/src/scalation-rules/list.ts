import { Collection, getModel } from "@lytos/constant-definitions";
import { type ScalationRule, ScalationRuleSchemaMongo, type Params, type Result } from "@lytos/contracts";

export const getAllScalationRules = async ({
    page = 1,
    limit = 10,
    search = '',
    workspaceId,
}: Params): Promise<Result<ScalationRule>> => {
    const model = getModel<ScalationRule>(Collection.ESCALATION_RULES, ScalationRuleSchemaMongo);

    const skip = (page - 1) * limit;

    const filter: { name?: { $regex: string, $options: string }, workspaceId: string } = { workspaceId };
    if (search?.trim()) {
        filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const items = await model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 });

    const total = await model.countDocuments(filter);

    const pages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const hasNextPage = page < pages;
    const nextPage = hasNextPage ? page + 1 : page;

    return {
        count: total,
        items,
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
