import { OAuth2Client } from "google-auth-library";
import { googleLogin } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type GoogleLoginRequestBody = {
    credential: string;
    workspaceSlug?: string;
};

export const loginGoogleRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/login/google",
    null,
    { tenant: "none", auth: "none" },
    async (req, reply) => {
        try {
            const body = req.body as GoogleLoginRequestBody;

            if (!body?.credential) {
                return reply.code(400).send({ message: "GOOGLE_CREDENTIAL_MISSING" });
            }

            const ticket = await googleClient.verifyIdToken({
                idToken: body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                return reply.code(401).send({ message: "INVALID_GOOGLE_TOKEN" });
            }

            if (!payload.email) {
                return reply.code(400).send({ message: "GOOGLE_EMAIL_MISSING" });
            }

            if (!payload.sub) {
                return reply.code(400).send({ message: "GOOGLE_SUB_MISSING" });
            }

            const out = await googleLogin({
                email: payload.email,
                name: payload.name ?? null,
                googleSub: payload.sub,
                workspaceSlug: body.workspaceSlug,
            });

            // reply.setCookie("refreshToken", out.refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "lax",
            //     path: "/",
            //     maxAge: 30 * 24 * 60 * 60, // 30 días
            // });

            return reply.code(200).send({
                accessToken: out.accessToken,
                user: out.user,
                membership: out.membership,
                scopes: out.scopes,
            });
        } catch (e) {
            const message = (e as { message?: string })?.message;

            if (message === "NO_WORKSPACE") {
                return reply.code(403).send({ message: "User has no active workspace" });
            }

            if (message === "USER_DISABLED") {
                return reply.code(403).send({ message: "User is disabled" });
            }

            if (message === "MEMBERSHIP_ROLE_MISSING") {
                return reply.code(500).send({ message: "Membership role missing" });
            }

            if (message === "ROLE_NOT_FOUND") {
                return reply.code(500).send({ message: "Role not found" });
            }

            return reply.code(500).send({
                message: message ?? "INTERNAL_SERVER_ERROR",
            });
        }
    }
);