import { Schema } from "mongoose";
import type { Ticket } from "./ticket";
import { baseFields, opts, tenantFields } from "../../../common";

export const TicketSchemaMongo = new Schema<Ticket>({
    title: { type: String, required: true, trim: true },
    ticketNumber: { type: String, required: true, index: true },
    subject: { type: String, trim: true },
    description: { type: String },
    status: { type: String, enum: ["open", "pending", "solved", "closed"], default: "open", index: true },
    priorityId: { type: String },
    categoryId: { type: String },
    typeId: { type: String },
    departmentId: { type: String },
    assigneeMembershipId: { type: String },
    customerId: { type: String, required: true, index: true },
    source: {
        channel: { type: String, enum: ["email", "widget", "webchat", "whatsapp", "call", "manual"], required: true },
        emailAccountId: { type: String },
        widgetId: { type: String },
    },
    tags: [{ type: String }],
    metrics: {
        firstResponseAt: { type: Date },
        firstResponseByMembershipId: { type: String },
        lastMessageAt: { type: Date },
        solvedAt: { type: Date },
        closedAt: { type: Date },
        reopenedCount: { type: Number, default: 0 },
    },
    sla: {
        policyId: { type: String },
        nextBreachAt: { type: Date },
        breached: { type: Boolean },
    },
    links: {
        mergedIntoTicketId: { type: String },
    },
    ...tenantFields,
    ...baseFields
}, opts);
