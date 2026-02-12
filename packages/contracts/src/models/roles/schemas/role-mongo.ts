import { Schema } from "mongoose";
import { Role } from "./role";
import { baseFields, opts, tenantFields } from "../../../common";

export const RoleSchemaMongo = new Schema<Role>({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    permissions: [{ type: String }],
    scopes: {
        ticketsRead: { type: String },
        ticketsAssign: { type: String },
        customersRead: { type: String }
    },
    isSystem: { type: Boolean },
    ...baseFields,
    ...tenantFields
}, opts);
