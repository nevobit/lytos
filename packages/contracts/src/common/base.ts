import { LifecycleStatus } from "./constants";

export type Timestamp = Date | string;

export interface Base<TId = string> {
    readonly id: TId;
    lifecycleStatus?: LifecycleStatus;
    readonly createdAt?: Timestamp;
    updatedAt?: Timestamp;
    readonly deletedAt?: Timestamp;
}

export interface Params {
    workspaceId: string;
    page?: number;
    limit?: number;
    search?: string;
}

export interface Query {
    lifecycleStatus: LifecycleStatus;
}