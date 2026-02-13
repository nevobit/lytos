import { Schema } from "mongoose";
import { Conversation } from "./conversation";
import { opts } from "../../../common";

export const ConversationSchemaMongo = new Schema<Conversation>({
    workspaceId: {
        type: String,
        required: true,
        index: true,
    },

    ticketId: {
        type: String,
        required: true,
        index: true,
    },

    type: {
        type: String,
        enum: ["main", "side", "widget"],
        required: true,
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
}, opts);