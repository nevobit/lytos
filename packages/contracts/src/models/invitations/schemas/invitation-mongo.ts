import { Schema } from "mongoose";
import { Invitation } from "./invitation";
import { baseFields, opts, tenantFields } from "../../../common";

export const InvitationSchemaMongo = new Schema<Invitation>({
    email: { type: String, required: true, trim: true },
    roleId: { type: String },
    departmentsIds: [{ type: String }],
    tokenHash: { type: String },
    status: { type: String },
    invitedByMembershipId: { type: String },
    expiresAt: { type: Date },
    ...baseFields,
    ...tenantFields
}, opts);
