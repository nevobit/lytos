import type { ScalationRule } from './schemas';

export type CreateScalationRuleDto = Omit<ScalationRule, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateScalationRuleDto = Partial<CreateScalationRuleDto>
