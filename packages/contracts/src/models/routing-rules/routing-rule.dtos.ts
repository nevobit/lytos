import type { RoutingRule } from './schemas';

export type CreateRoutingRuleDto = Omit<RoutingRule, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoutingRuleDto = Partial<CreateRoutingRuleDto>
