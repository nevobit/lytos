import crypto from "crypto";
import { Role, scopesForRole } from "@lytos/security";
import { issueTokens } from "./tokens";
import { createSession } from "../sessions";
import { findRoleById } from "../roles";
import { findWorkspaceBySlug } from "../workspaces";
import { findActiveMembershipUserByUserId } from "../memberships";
import { findOneUser, createUserFromGoogle } from "../users";
import { LifecycleStatus, type Membership } from "@lytos/contracts";

export type GoogleLoginInput = {
    email: string;
    name?: string | null;
    googleSub: string;
    workspaceSlug?: string;
};

export type GoogleLoginOutput = {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string | null };
    membership: Membership;
    scopes: string[];
};

export async function googleLogin(input: GoogleLoginInput): Promise<GoogleLoginOutput> {
    const email = input.email.trim().toLowerCase();
    if (!email) throw new Error("GOOGLE_EMAIL_MISSING");

    let user = await findOneUser("email", email);

    if (!user) {
        user = await createUserFromGoogle({
            email,
            name: input.name ?? null,
            googleSub: input.googleSub,
            lifecycleStatus: LifecycleStatus.ACTIVE,
        });
    }

    if (user.lifecycleStatus !== "active") throw new Error("USER_DISABLED");

    const memberships = await findActiveMembershipUserByUserId(user.id);
    if (!memberships.length) throw new Error("NO_WORKSPACE");

    let membership = memberships[0];

    if (input.workspaceSlug) {
        const ws = await findWorkspaceBySlug(input.workspaceSlug);
        if (ws) {
            const m = memberships.find((x: Membership) => x.workspaceId === ws.id);
            if (m) membership = m;
        }
    }

    if (!membership?.roleId) throw new Error("MEMBERSHIP_ROLE_MISSING");
    const role = await findRoleById(membership.roleId);
    if (!role) throw new Error("ROLE_NOT_FOUND");

    const scopes = scopesForRole(role.name as Role);

    const sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;
    const { accessToken, refreshToken } = await issueTokens(
        user.id,
        membership.workspaceId,
        role.name,
        scopes,
        sessionId,
    );

    const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await createSession({
        userId: user.id,
        sessionId,
        refreshTokenHash: refreshHash,
        status: "active",
        device: { userAgent: "", ipAddress: "", type: "other" },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name ?? null },
        membership,
        scopes,
    };
}
