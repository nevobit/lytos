import { Schema } from "mongoose";
import { Ticket } from "./ticket";
import { baseFields, opts, tenantFields } from "../../../common";

export const TicketSchemaMongo = new Schema<Ticket>({
    title: { type: String },
    ...tenantFields,
    ...baseFields
}, opts);
