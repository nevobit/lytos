import { Collection, getModel } from "@lytos/constant-definitions";
import { ScalationRuleSchemaMongo, type ScalationRule } from "@lytos/contracts";

export const deleteScalationRule = async (
    workspaceId: string,
    ruleId: string,
) => {
    const model = getModel<ScalationRule>(Collection.ESCALATION_RULES, ScalationRuleSchemaMongo);

    const rule = await model.findOne({ _id: ruleId, workspaceId });
    if (!rule) throw new Error("NOT_FOUND");

    await model.deleteOne({ _id: ruleId, workspaceId });

    return { ok: true };
};
