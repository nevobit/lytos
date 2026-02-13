import { Schema } from "mongoose";
import { User } from "./user";
import { baseFields, opts } from "../../../common";

export const UserSchemaMongo = new Schema<User>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    security: {
        twoFactorEnabled: { type: Boolean },
        twoFactorMethod: { type: String },
        totpSecretEnc: { type: String },
        recoveryCodesHash: [{ type: String }]
    },
    isEmailVerified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    userAgent: { type: String },
    loginAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date },
    ...baseFields
}, opts);
