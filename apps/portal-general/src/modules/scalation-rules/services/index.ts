import { api } from "@/shared/api";
import type {
    ScalationRule,
    Result,
} from "@lytos/contracts";

export const scalationRules = async (): Promise<Result<ScalationRule>> => {
    const { data } = await api.get(`/scalation-rules`);
    return data;
};

export const createScalationRule = async (
    rule: Partial<ScalationRule>,
): Promise<ScalationRule> => {
    const { data } = await api.post(`/scalation-rules`, rule);
    return data;
};

export const updateScalationRule = async (
    rule: Partial<ScalationRule>,
): Promise<ScalationRule> => {
    const { data } = await api.patch(`/scalation-rules/${rule.id}`, rule);
    return data;
};

export const deleteScalationRule = async (id: string): Promise<{ ok: true }> => {
    const { data } = await api.delete(`/scalation-rules/${id}`);
    return data;
};
