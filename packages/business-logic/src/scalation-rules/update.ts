import { Collection, getModel } from "@lytos/constant-definitions";
import {
    ScalationRuleSchemaMongo,
    type ScalationRule,
    type UpdateScalationRuleDto,
} from "@lytos/contracts";

export const updateScalationRule = async (
    workspaceId: string,
    ruleId: string,
    dto: UpdateScalationRuleDto,
): Promise<ScalationRule | null> => {
    const model = getModel<ScalationRule>(Collection.ESCALATION_RULES, ScalationRuleSchemaMongo);

    const existing = await model.findOne({ _id: ruleId, workspaceId }).lean();
    if (!existing) throw new Error("NOT_FOUND");

    const update: Partial<ScalationRule> = {};

    if (dto.name !== undefined) {
        const name = dto.name.trim();
        if (!name) throw new Error("BAD_REQUEST");
        const dupQuery: { departmentId?: string, workspaceId: string, name: string, _id: { $ne: string } } = { workspaceId, name, _id: { $ne: ruleId } };
        if (dto.departmentId !== undefined) dupQuery.departmentId = dto.departmentId;
        if (existing.departmentId) dupQuery.departmentId = existing.departmentId;
        const dup = await model.findOne(dupQuery);
        if (dup) throw new Error("NAME_TAKEN");
        update.name = name;
    }

    if (dto.departmentId !== undefined) {
        update.departmentId = dto.departmentId;
    }

    if (dto.enabled !== undefined) update.enabled = dto.enabled;
    if (dto.trigger !== undefined) update.trigger = dto.trigger;
    if (dto.conditions !== undefined) {
        if (!Array.isArray(dto.conditions) || dto.conditions.length === 0) throw new Error("BAD_REQUEST");
        update.conditions = dto.conditions;
    }
    if (dto.actions !== undefined) {
        if (!Array.isArray(dto.actions) || dto.actions.length === 0) throw new Error("BAD_REQUEST");
        update.actions = dto.actions;
    }

    await model.updateOne({ _id: ruleId, workspaceId }, { $set: update });

    return model.findOne({ _id: ruleId, workspaceId });
};
