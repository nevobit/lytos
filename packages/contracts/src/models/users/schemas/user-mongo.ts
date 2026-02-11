import { Schema } from "mongoose";
import { User } from "./user";
import { baseFields, opts } from "../../../common";

export const UserSchemaMongo = new Schema<User>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String },
    ...baseFields
}, opts);
