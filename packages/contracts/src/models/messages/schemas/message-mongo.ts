import { Schema } from "mongoose";
import { type Message } from "./message";
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
        required: true,
        index: true,
    },

    direction: {
        type: String,
        enum: ["inbound", "outbound", "internal"],
        required: true,
    },

    kind: {
        type: String,
        enum: ["message", "note", "system"],
        required: true,
    },

    body: {
        text: {
            type: String,
        },
        html: {
            type: String,
        },
    },
}, opts);

MessageSchemaMongo.add({
    authorMembershipId: {
        type: String,
        required: function requiredAuthorMembershipId(this: Message) {
            return this.direction === "internal" || this.direction === "outbound";
        },
    },
    customerId: {
        type: String,
        required: function requiredCustomerId(this: Message) {
            return this.direction === "inbound";
        },
    },
});

MessageSchemaMongo.pre("validate", function validateBody(next) {
    const body = this.body;

    if (!body) {
        this.invalidate("body", "Either body.text or body.html is required");
        return next();
    }

    const text = typeof body.text === "string" ? body.text.trim() : "";
    const html = typeof body.html === "string" ? body.html.trim() : "";

    if (text.length === 0 && html.length === 0) {
        this.invalidate("body", "Either body.text or body.html is required");
    }

    return next();
});

MessageSchemaMongo.index({ workspaceId: 1, ticketId: 1, createdAt: 1 });
