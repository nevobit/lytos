import { Schema } from "mongoose";
import { type Workspace } from "./workspace";
import { baseFields, opts } from "../../../common";

export const WorkspaceSchemaMongo = new Schema<Workspace>({
    name: { type: String, required: true, trim: true },
    employees: { type: String, required: true, trim: true },


    slug: { type: String, required: true, trim: true, index: true },
    timezone: { type: String, required: true },
    locale: { type: String, required: true },

    ownerId: { type: String, required: true, index: true },

    branding: {
        logoUrl: { type: String },
        primaryColor: { type: String },
        secondaryColor: { type: String },
        backgroundColor: { type: String },
    },

    plan: {
        name: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
        seatsLimit: { type: Number, default: 3 },
        channelsEnabled: [{ type: String, enum: ["email", "widget", "whatsapp", "webchat", "calls"] }],
    },

    settings: {
        ticketNumberPrefix: { type: String, required: true },
        allowReopenClosed: { type: Boolean },
        defaultTicketStatus: { type: String, enum: ["open", "pending", "closed"], default: "open" },
        defaultPropertyId: { type: String },
        defaultDeparmentId: { type: String },
        businessHoursId: { type: String },
    },

    url: { type: String, required: true, trim: true },
    domains: [{
        customDomains: [{ type: String }],
        allowedOrigins: [{ type: String }],
    }],
    ...baseFields,
}, opts);
