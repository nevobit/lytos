import { Schema } from 'mongoose';
import type { TicketStatus } from './ticket-status';
import { baseFields, opts, tenantFields } from "../../../common";

export const TicketStatusSchemaMongo = new Schema<TicketStatus>({
    name: { type: String, required: true },
    description: { type: String },
    isDefault: { type: Boolean, default: false },
    ...tenantFields,
    ...baseFields
}, opts);
