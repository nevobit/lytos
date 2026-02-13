import { Schema } from "mongoose";
import { baseFields, opts, tenantFields } from "../../../common";
import { Department } from "./department";

export const DepartmentSchemaMongo = new Schema<Department>({
    name: { type: String, required: true, trim: true },
    slug: { type: String },
    description: { type: String },
    isDefault: { type: Boolean },
    leadMembershipIds: [{ type: String }],
    primaryLeadMembershipId: { type: String, ref: 'Users' },
    ...baseFields,
    ...tenantFields
}, opts);
