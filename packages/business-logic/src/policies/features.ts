import type { FeatureFlag } from "@lytos/contracts";

export const planFeatures: Record<"free" | "pro" | "enterprise", FeatureFlag[]> = {
    free: [],
    pro: ["advancedAudit", "bulkInvite"],
    enterprise: ["advancedAudit", "bulkInvite", "prioritySupport", "sso"],
};

export const hasFeature = (plan: "free" | "pro" | "enterprise", feature: FeatureFlag): boolean =>
    planFeatures[plan].includes(feature);
