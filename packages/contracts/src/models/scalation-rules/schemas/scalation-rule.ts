import { type Base } from '../../../common';

export type RuleCondition = {
    field: string;
    op: string;
    value: unknown;
};

export type RuleAction = {
    type: 'notify' | 'reassign' | 'set_priority' | 'add_tag';
    value: unknown;
};

export interface ScalationRule extends Base {
    workspaceId: string;
    departmentId?: string;
    name: string;
    enabled: boolean;
    trigger: 'sla_breach' | 'time_in_status';
    conditions: RuleCondition[];
    actions: RuleAction[];
}
