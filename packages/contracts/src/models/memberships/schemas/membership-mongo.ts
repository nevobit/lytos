import { Schema } from "mongoose";
import { Membership } from "./membership";
import { baseFields, opts, tenantFields } from "../../../common";

export const MembershipSchemaMongo = new Schema<Membership>({
    roleId: { type: String },
    departmentIds: [{ type: String }],
    primaryDepartmentId: { type: String },
    inviteeEmail: { type: String },
    title: { type: String },
    status: { type: String, enum: ["invited", "active", "suspended"] },
    profile: {
        displayName: { type: String },
        signature: { type: String },
        avatar: { type: String },
        locale: { type: String },
    },
    preferences: {
        notifications: {
            email: { type: Boolean },
            inApp: { type: Boolean }
        }
    },
    invitedBy: { type: String, ref: 'users' },
    invitedAt: { type: Date },
    joinedAt: { type: Date },
    ...tenantFields,
    ...baseFields,
}, opts);