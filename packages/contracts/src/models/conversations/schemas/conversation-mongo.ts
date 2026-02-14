import { Schema } from "mongoose";
import type { Conversation } from "./conversation";
import { LifecycleStatus, opts } from "../../../common";

export const ConversationSchemaMongo = new Schema<Conversation>({
    workspaceId: {
        type: String,
        required: true,
        index: true,
        immutable: true,
    },

    ticketId: {
        type: String,
        required: true,
        index: true,
        immutable: true,
    },

    type: {
        type: String,
        enum: ["main", "side", "widget"],
        required: true,
        immutable: true,
    },

    channel: {
        type: String,
        enum: ["email", "widget", "webchat", "whatsapp", "internal"],
        required: true,
    },
    participants: {
        customers: [
            {
                type: String,
                ref: "Customer",
            },
        ],
        agents: [
            {
                type: String,
                ref: "Membership",
            },
        ],
        visitorId: {
            type: String,
        },
    },
    subject: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
        required: true,
        index: true,
    },
    lifecycleStatus: {
        type: String,
        enum: Object.values(LifecycleStatus),
        default: LifecycleStatus.ACTIVE,
        index: true,
    },
    deletedAt: {
        type: Date,
    },
}, opts);

ConversationSchemaMongo.index({ workspaceId: 1, ticketId: 1, type: 1 });
ConversationSchemaMongo.index(
    { workspaceId: 1, ticketId: 1 },
    {
        unique: true,
        partialFilterExpression: { type: "main" },
        name: "uniq_main_conversation_per_ticket",
    },
);