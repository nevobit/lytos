import { type User } from "@lytos/contracts";
import { findOneUser } from "../users";
import { verifyPassword } from "@lytos/security";
import { createSession } from "../sessions";
import { issueTokens } from "./tokens";
import * as crypto from 'crypto';

export type LoginInput = {
    email: string;
    password: string;
    workspaceSlug?: string;
};

export type LoginOutput = {
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
};

export async function login(input: LoginInput): Promise<LoginOutput> {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    const user = await findOneUser('email', email);

    if (!user || user.lifecycleStatus !== "active") throw new Error("INVALID_CREDENTIALS");

    const ok = await verifyPassword(user.password || '', password);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    const sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;

    const { accessToken, refreshToken } = await issueTokens({
        kind: "global",
        userId: user.id,
        sessionId
    });

    const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await createSession({ userId: user.id, sessionId, refreshTokenHash: refreshHash, status: "active", device: { userAgent: "", ipAddress: "", type: "other" }, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return {
        accessToken,
        refreshToken,
        user
    };
}