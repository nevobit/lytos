import { Schema } from 'mongoose';
import type { TicketCategory } from './ticket-category';

export const TicketCategorySchemaMongo = new Schema<TicketCategory>({
    workspaceId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    isDefault: { type: Boolean, default: false },
});
