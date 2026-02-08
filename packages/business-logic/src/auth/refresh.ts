import crypto from "crypto";
import { Role, scopesForRole, verifyMainJwt } from "@lytos/security";
import { issueTokens } from "./tokens";
import { findRoleById } from "../roles";
import { findActiveMembershipUserByUserId } from "../memberships";
import { findActiveSessionByUserIdAndHash, rotateSessionRefreshHash } from "../sessions";
import { findWorkspaceById } from "../workspaces";

export type RefreshInput = {
    refreshToken: string;
    workspaceSlug?: string;
};

export type RefreshOutput = {
    accessToken: string;
    refreshToken: string;
};

type RefreshTokenPayload = {
    id: string;
    email: string;
    sub: string;
    sessionId: string;
};

const { JWT_REFRESH_SECRET } = process.env;

export async function refresh(input: RefreshInput): Promise<RefreshOutput> {
    if (!input.refreshToken) throw new Error("REFRESH_TOKEN_REQUIRED");

    let decoded: { id: string; sessionId: string };
    try {
        const res = await verifyMainJwt<RefreshTokenPayload>(input.refreshToken, {
            secretOrPublicKey: JWT_REFRESH_SECRET!,
            audience: "lytos.api",
            issuer: "lytos.auth",
            required: {
                sub: true,
            },
        });

        if (!res.ok) {
            throw new Error(res.message);
        }

        decoded = res.payload;

    } catch (e: unknown) {
        const msg = (e as { name: string })?.name === "JWTExpired" ? "REFRESH_EXPIRED" : "REFRESH_INVALID";
        throw new Error(msg);
    }

    const { id, sessionId } = decoded;
    if (!id || !sessionId) throw new Error("REFRESH_INVALID");

    const oldRefreshHash = crypto.createHash("sha256").update(input.refreshToken).digest("hex");
    const session = await findActiveSessionByUserIdAndHash(id, oldRefreshHash);
    if (!session) throw new Error("SESSION_NOT_FOUND_OR_REVOKED");

    const memberships = await findActiveMembershipUserByUserId(id);
    if (!memberships.length) throw new Error("NO_WORKSPACE");

    let membership = memberships[0];

    if (input.workspaceSlug && membership?.workspaceId) {
        const ws = await findWorkspaceById(membership?.workspaceId)
        const wanted = memberships.find(() => ws?.slug === input.workspaceSlug);
        if (wanted) membership = wanted;
    }

    if (!membership?.roleId) throw new Error("MEMBERSHIP_ROLE_MISSING");
    const role = await findRoleById(membership?.roleId);
    if (!role) throw new Error("ROLE_NOT_FOUND");

    const scopes = scopesForRole(role.name as Role);

    const { accessToken, refreshToken: newRefreshToken } = await issueTokens(
        id,
        membership.workspaceId,
        role.name,
        scopes,
        sessionId,
    );

    const newRefreshHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    await rotateSessionRefreshHash(session.id, newRefreshHash);

    return { accessToken, refreshToken: newRefreshToken };
}
