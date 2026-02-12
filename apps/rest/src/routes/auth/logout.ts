import { logout } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt, type JwtClaims } from "@lytos/security";

type LogoutDto = { all?: boolean };

export const logoutRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/logout",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (req, reply) => {
        if (!req.auth) return reply.code(401).send({ message: "Unauthorized" });

        const claims = req.auth.claims as JwtClaims;
        const sessionId = claims.sessionId as string | undefined;

        if (!sessionId) return reply.code(400).send({ message: "Missing sessionId in token claims" });

        const body = (req.body ?? {}) as LogoutDto;

        try {
            const out = await logout({
                userId: req.auth.userId,
                sessionId,
                all: body.all === true,
            });

            return reply.code(200).send(out);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Bad request" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
