import { Schema } from "mongoose";
import { type Customer } from "./customer";
import { baseFields, opts, tenantFields } from "../../../common";

export const CustomerSchemaMongo = new Schema<Customer>({
    name: { type: String },
    displayName: { type: String },
    locale: { type: String },
    phones: [{
        value: { type: String },
        primary: { type: Boolean },
    }],
    userId: { type: String },
    location: {
        country: { type: String },
        city: { type: String }
    },
    emails: [{
        value: { type: String },
        primary: { type: Boolean },
    }],
    ...tenantFields,
    ...baseFields
}, opts);
