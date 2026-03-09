import { Schema } from "mongoose";
import { baseFields, opts, tenantFields } from "../../../common";
import type { ScalationRule } from "./scalation-rule";

export const ScalationRuleSchemaMongo = new Schema<ScalationRule>({
    departmentId: { type: String },
    name: { type: String, trim: true },
    enabled: { type: Boolean, default: true },
    trigger: { type: String, enum: ['sla_breach', 'time_in_status'] },
    conditions: [
        {
            field: { type: String },
            op: { type: String },
            value: { type: Schema.Types.Mixed },
        },
    ],
    actions: [
        {
            type: { type: String, enum: ['notify', 'reassign', 'set_priority', 'add_tag'] },
            value: { type: Schema.Types.Mixed },
        },
    ],
    ...tenantFields,
    ...baseFields,
}, opts);
