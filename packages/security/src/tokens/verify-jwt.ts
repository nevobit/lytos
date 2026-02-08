import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS_URL = process.env.JWT_JWKS_URL;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;

if (!JWKS_URL) {
    throw new Error("JWT_JWKS_URL is not defined");
}

const jwks = createRemoteJWKSet(new URL(JWKS_URL));

interface RequestInterface {
    Body: unknown;
    Query: unknown;
    Headers: unknown;
}

interface NormalizedRequest<R extends RequestInterface = RequestInterface> {
    protocol: string;
    secure?: boolean;
    subdomains?: string[];
    path?: string;
    hostname?: string;
    headers?: R['Headers'];
    body?: R['Body'];
    method?: string;
    query?: R['Query'];
    url?: string;
    ip?: string;
}

type JwtClaims = {
    sub: string;
    workspaceId?: string;
    companyId?: string;
    role?: 'owner' | 'admin' | 'member' | string;
    scopes?: string[];
    sessionId?: string;
};

type VerifyTokenResult =
    | { ok: true; claims: JwtClaims }
    | { ok: false; code: 401 | 403 | 500; type: 'unauthorized' | 'invalid_token' | 'forbidden' | 'config_error'; message: string };


type AuthFunction = (req: NormalizedRequest) => Promise<VerifyTokenResult>;


export const verifyJwt: AuthFunction = async (
    req: NormalizedRequest
): Promise<VerifyTokenResult> => {
    try {
        const authHeader = (req.headers as unknown as Record<string, string>)["authorization"];
        const token = typeof authHeader === "string"
            ? authHeader.replace(/^Bearer\s+/i, "")
            : null;

        if (!token) {
            return {
                ok: false,
                code: 401,
                type: "unauthorized",
                message: "Missing bearer token",
            };
        }

        const { payload } = await jwtVerify(token, jwks, {
            issuer: ISSUER,
            audience: AUDIENCE,
            clockTolerance: 5,
        });

        const claims: JwtClaims = {
            sub: payload.sub as string,
            workspaceId: payload.workspaceId as string | undefined,
            role: payload.role as string | undefined,
            scopes: Array.isArray(payload.scopes)
                ? payload.scopes
                : typeof payload.scope === "string"
                    ? payload.scope.split(" ")
                    : undefined,
            sessionId: payload.sid as string | undefined,
        };

        if (!claims.sub) {
            return {
                ok: false,
                code: 401,
                type: "invalid_token",
                message: "Token missing sub",
            };
        }

        return { ok: true, claims };
    } catch (err) {
        return {
            ok: false,
            code: 401,
            type: "invalid_token",
            message: (err as unknown as { message: string })?.message ?? "Invalid token",
        };
    }
};
