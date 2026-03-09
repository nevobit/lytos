import { Collection, getModel } from "@lytos/constant-definitions";
import {
    type ScalationRule,
    ScalationRuleSchemaMongo,
    type CreateScalationRuleDto,
} from "@lytos/contracts";

export const createScalationRule = async (
    workspaceId: string,
    dto: CreateScalationRuleDto,
): Promise<ScalationRule> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");
    if (!dto.trigger) throw new Error("BAD_REQUEST");
    if (!Array.isArray(dto.conditions) || dto.conditions.length === 0) throw new Error("BAD_REQUEST");
    if (!Array.isArray(dto.actions) || dto.actions.length === 0) throw new Error("BAD_REQUEST");

    const model = getModel<ScalationRule>(Collection.ESCALATION_RULES, ScalationRuleSchemaMongo);

    // unique name per workspace/department combination
    const query: { departmentId?: string, name?: string, workspaceId: string } = { workspaceId, name: dto.name.trim() };

    if (dto.departmentId) query.departmentId = dto.departmentId;

    const exists = await model.findOne(query);
    if (exists) throw new Error("NAME_TAKEN");

    const rule = await model.create({
        workspaceId,
        departmentId: dto.departmentId,
        name: dto.name.trim(),
        enabled: dto.enabled ?? true,
        trigger: dto.trigger,
        conditions: dto.conditions,
        actions: dto.actions,
    });

    return rule.toObject();
};
