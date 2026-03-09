import { Schema } from "mongoose";
import { baseFields, opts, tenantFields } from "../../../common";
import { TicketPriority } from "./ticket-priority";

export const TicketPrioritySchemaMongo = new Schema<TicketPriority>({
    name: { type: String, trim: true },
    level: { type: Number },
    color: { type: String },
    isDefault: { type: Boolean },
    ...tenantFields,
    ...baseFields
}, opts);
