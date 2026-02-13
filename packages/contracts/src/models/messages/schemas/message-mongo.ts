import { Schema } from "mongoose";
import { Message } from "./message";
import { opts } from "../../../common";

export const MessageSchemaMongo = new Schema<Message>({
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

    conversationId: {
        type: String,
        index: true,
    },

    kind: {
        type: String,
        enum: ["reply", "note", "system"],
        required: true,
    },

    visibility: {
        type: String,
        enum: ["public", "internal"],
        required: true,
    },

    direction: {
        type: String,
        enum: ["inbound", "outbound", "internal"],
        required: true,
    },

    channel: {
        type: String,
        enum: ["email", "widget", "webchat", "whatsapp", "internal"],
        required: true,
    },

    author: {
        type: {
            type: String,
            enum: ["agent", "customer", "visitor", "system"],
            required: true,
        },
        membershipId: {
            type: String,
            ref: "Membership",
        },
        customerId: {
            type: String,
            ref: "Customer",
        },
        visitorId: {
            type: String,
        },
    },

    body: {
        text: {
            type: String,
            required: true,
        },
        html: {
            type: String,
        },
    },

    attachments: [
        {
            attachmentId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
    ],

    emailMeta: {
        messageId: String,
        inReplyTo: String,
        references: [String],
        subject: String,
        from: String,
        to: [String],
    },

    delivery: {
        status: {
            type: String,
            enum: ["queued", "sent", "delivered", "failed"],
        },
        provider: String,
        providerMessageId: String,
        error: {
            code: String,
            message: String,
        },
        sentAt: Date,
        deliveredAt: Date,
    },
}, opts);