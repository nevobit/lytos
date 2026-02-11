import { issueJwt } from "@lytos/security";

export async function issueTokens(userId: string, sessionId: string) {
    const accessToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_SECRET!,
        payload: { id: userId, sessionId, jti: crypto.randomUUID(), },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: "accessApi",
        algorithm: "HS256",
        expiresIn: "1d",
        notBefore: "0s",
        keyid: "access-hs256-v1"
    });

    const refreshToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_REFRESH_SECRET!,
        payload: {
            id: userId,
            sessionId
        },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: "refreshToken",
        expiresIn: "7d",
        notBefore: "0s",
        keyid: "refresh-hs256-v1"

    });
    return { accessToken, refreshToken };
}