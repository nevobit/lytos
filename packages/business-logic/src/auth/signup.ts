import { type CreateUserDto, LifecycleStatus, type User } from "@lytos/contracts";
import { findOneUser, createUser } from "../users";
import * as crypto from 'crypto';
import { issueTokens } from "./tokens";
import { createSession } from "../sessions";

export type SignupOutput = {
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
};

export const signup = async (input: CreateUserDto): Promise<SignupOutput> => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) throw new Error("INVALID_INPUT");

    const exists = await findOneUser("email", email);
    if (exists) throw new Error("EMAIL_TAKEN");

    const user = await createUser({
        ...input,
        email,
        name: input.name ?? null,
        lifecycleStatus: LifecycleStatus.ACTIVE,
        userAgent: input.userAgent
    });

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
