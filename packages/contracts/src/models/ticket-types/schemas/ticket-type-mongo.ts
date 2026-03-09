import { Schema } from 'mongoose';
import type { TicketType } from './ticket-type';

export const TicketTypeSchemaMongo = new Schema<TicketType>({
    workspaceId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    isDefault: { type: Boolean, default: false },
});
