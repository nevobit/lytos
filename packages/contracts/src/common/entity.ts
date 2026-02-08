import { LifecycleStatus } from "./constants";

export const opts = { timestamps: true, versionKey: false } as const;

export const baseFields = {
    lifecycleStatus: { type: String, default: LifecycleStatus.ACTIVE },
    deletedAt: { type: Date },
} as const;

export const tenantField = {
    workspaceId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
} as const;

export const externalFields = {
    externalSource: { type: String, required: true, index: true },
    externalId: { type: String, required: true, index: true },
    externalUpdatedAt: { type: Date },
} as const;

export const slugName = {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, index: true },
} as const;
