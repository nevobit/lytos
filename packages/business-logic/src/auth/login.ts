import { Membership, User } from "@lytos/contracts";
import { findOneUser } from "../users";
import { verifyPassword } from "./password";
import { findWorkspaceBySlug } from "../workspaces";
import { Role, scopesForRole } from "@lytos/security";
import { createSession } from "../sessions";
import { issueTokens } from "./tokens";
import { findActiveMembershipUserByUserId } from "../memberships";
import { findRoleById } from "../roles";
import crypto from 'crypto';

export type LoginInput = {
    email: string;
    password: string;
    workspaceSlug?: string;
};

export type LoginOutput = {
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
    membership: Membership;
    scopes: string[];
};

export async function login(input: LoginInput): Promise<LoginOutput> {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    const user = await findOneUser('email', email);
    if (!user || user.lifecycleStatus !== "active") throw new Error("INVALID_CREDENTIALS");

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

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
        user.id, membership.workspaceId, role.name, scopes, sessionId
    );

    const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await createSession({ userId: user.id, sessionId, refreshTokenHash: refreshHash, status: "active", device: { userAgent: "", ipAddress: "", type: "other" }, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name ?? null },
        membership,
        scopes,
    };
}