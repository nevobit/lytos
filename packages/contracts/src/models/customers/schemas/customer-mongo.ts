import { Schema } from "mongoose";
import { type Customer } from "./customer";
import { baseFields, opts, tenantFields } from "../../../common";

export const CustomerSchemaMongo = new Schema<Customer>({
    name: { type: String },
    displayName: { type: String },
    ...tenantFields,
    ...baseFields
}, opts);
