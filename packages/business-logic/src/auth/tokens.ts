import { issueJwt } from "@lytos/security";

export async function issueTokens(userId: string, workspaceId: string, role: string, scopes: string[], sessionId: string) {
    const accessToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_SECRET!,
        payload: { id: userId, role, ws: workspaceId, scopes, sessionId, jti: crypto.randomUUID(), },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: "accessApi",
        algorithm: "HS256",
        expiresIn: "1d",
        keyid: "access-hs256-v1"
    });

    const refreshToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_REFRESH_SECRET!,
        payload: {
            id: userId,
            role,
            ws: workspaceId,
            scopes,
            sessionId
        },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: "refreshToken",
        expiresIn: "7d",
        keyid: "refresh-hs256-v1"

    });
    return { accessToken, refreshToken };
}