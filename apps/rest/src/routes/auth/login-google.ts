import { OAuth2Client } from "google-auth-library";
import { googleLogin } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

const googleClientId = process.env.GOOGLE_CLIENT_ID;

if (!googleClientId) {
    throw new Error("GOOGLE_CLIENT_ID_MISSING");
}

const googleClient = new OAuth2Client(googleClientId);

type GoogleLoginRequestBody = {
    credential: string;
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
                audience: googleClientId,
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

            if (payload.email_verified === false) {
                return reply.code(401).send({ message: "GOOGLE_EMAIL_NOT_VERIFIED" });
            }

            const out = await googleLogin({
                email: payload.email,
                name: payload.name ?? null,
                googleSub: payload.sub,
            });

            return reply.code(200).send(out);
        } catch (e) {
            const message = (e as { message?: string })?.message;

            if (message === "USER_DISABLED") {
                return reply.code(403).send({ message: "User is disabled" });
            }

            return reply.code(500).send({
                message: message ?? "INTERNAL_SERVER_ERROR",
            });
        }
    }
);