import * as crypto from "crypto";
import { issueTokens } from "./tokens";
import { createSession } from "../sessions";
import { findOneUser, createUserFromGoogle } from "../users";
import { LifecycleStatus, type User } from "@lytos/contracts";

export type GoogleLoginInput = {
    email: string;
    name?: string | null;
    googleSub: string;
};

export type GoogleLoginOutput = {
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
};

export async function googleLogin(input: GoogleLoginInput): Promise<GoogleLoginOutput> {
    const email = input.email.trim().toLowerCase();
    if (!email) throw new Error("GOOGLE_EMAIL_MISSING");
    if (!input.googleSub) throw new Error("GOOGLE_SUB_MISSING");

    let user = await findOneUser("email", input.email);

    if (!user) {
        user = await findOneUser("email", email);
    }

    if (!user) {
        user = await createUserFromGoogle({
            email,
            name: input.name ?? null,
            googleSub: input.googleSub,
            lifecycleStatus: LifecycleStatus.ACTIVE,
        });
    }

    if (user.lifecycleStatus !== LifecycleStatus.ACTIVE) {
        throw new Error("USER_DISABLED");
    }

    const sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;

    const { accessToken, refreshToken } = await issueTokens({
        kind: "global",
        userId: user.id,
        sessionId,
    });

    const refreshHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    await createSession({
        userId: user.id,
        sessionId,
        refreshTokenHash: refreshHash,
        status: "active",
        device: {
            userAgent: "",
            ipAddress: "",
            type: "other",
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        refreshToken,
        user,
    };
}