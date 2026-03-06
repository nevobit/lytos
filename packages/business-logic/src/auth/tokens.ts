import { issueJwt } from "@lytos/security";

type TokenKind = "global" | "workspace";

type IssueTokensInput = {
    kind: TokenKind;
    userId: string;
    sessionId: string;

    workspaceId?: string;
    membershipId?: string;
    roleId?: string;
};

export async function issueTokens(input: IssueTokensInput) {
    const { kind, userId, sessionId, workspaceId, membershipId, roleId } = input;

    const accessToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_SECRET!,
        payload: {
            typ: "access",
            kind,
            userId,
            sessionId,
            workspaceId: kind === "workspace" ? workspaceId : undefined,
            membershipId: kind === "workspace" ? membershipId : undefined,
            roleId: kind === "workspace" ? roleId : undefined,
            jti: crypto.randomUUID(),
        },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: userId,
        algorithm: "HS256",
        expiresIn: "1d",
        notBefore: "0s",
        keyid: "access-hs256-v1"
    });

    const refreshToken = issueJwt({
        secretOrPrivateKey: process.env.JWT_REFRESH_SECRET!,
        payload: {
            typ: "refresh",
            kind: 'global',
            userId,
            sessionId,
            jti: crypto.randomUUID(),
        },
        issuer: "lytos.auth",
        audience: "lytos.api",
        subject: userId,
        expiresIn: "7d",
        notBefore: "0s",
        keyid: "refresh-hs256-v1"

    });
    return { accessToken, refreshToken };
}