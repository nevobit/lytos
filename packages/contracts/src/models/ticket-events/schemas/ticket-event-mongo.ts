import { Schema } from "mongoose";
import type { TicketEvent } from "./ticket-event";
import { opts } from "../../../common";

export const TicketEventSchemaMongo = new Schema<TicketEvent>({
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
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    actorMembershipId: {
        type: String,
    },
    actorCustomerId: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ["public", "internal"],
        default: "public",
    },
    metadata: {
        type: Schema.Types.Mixed,
    },
}, opts);

TicketEventSchemaMongo.index({ workspaceId: 1, ticketId: 1, createdAt: 1 });
