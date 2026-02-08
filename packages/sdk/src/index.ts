import { createClient, SdkOptions } from "./core";

export * from "./core";

export { createClient } from "./core";
export { createGraphQL } from "./graphql";

export type {
    Plan, PlanLimits, FeatureFlag
} from "@lytos/contracts";

export type Client = ReturnType<typeof createClient>;

export const client = (opts: SdkOptions) => {
    const apiClient = createClient(opts);

    return {
        list: async () => apiClient.get("/list"),
    }
}