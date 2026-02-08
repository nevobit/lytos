import { login } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

export const loginRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/auth/login",
    null,
    { tenant: "none", auth: "none" },
    async (req, reply) => {
        try {
            const out = await login(req.body as {
                email: string;
                password: string;
                workspaceSlug?: string;
            });
            return reply.code(200).send(out);
        } catch (e: { message: string }) {
            if (e?.message === "INVALID_CREDENTIALS") return reply.code(401).send({ message: "Invalid credentials" });
            if (e?.message === "NO_WORKSPACE") return reply.code(403).send({ message: "User has no active workspace" });
            return reply.code(500).send({ message: "Login failed" });
        }
    }
);
