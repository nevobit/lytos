import { Schema } from "mongoose";
import { type Session } from "./session";
import { baseFields, opts } from "../../../common";

export const SessionSchemaMongo = new Schema<Session>({
    userId: { type: String, required: true },
    refreshTokenHash: { type: String, required: true },
    sessionId: { type: String },
    status: { type: String, enum: ["active", "revoked"], required: true },
    device: {
        userAgent: { type: String },
        ipAddress: { type: String },
        type: { type: String, enum: ["desktop", "mobile", "tablet", "other"], }
    },
    expiresAt: { type: Date, required: true },
    ...baseFields,
}, opts);
