import { login } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

export const loginRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/login",
    null,
    { tenant: "none", auth: "none" },
    async (req, reply) => {

        try {
            const out = await login(req.body as {
                email: string;
                password: string;
            });
            return reply.code(200).send(out);
        } catch (e) {
            console.log(e)
            if ((e as unknown as { message: string })?.message === "INVALID_CREDENTIALS") return reply.code(401).send({ message: "Invalid credentials" });
            if ((e as unknown as { message: string })?.message === "NO_WORKSPACE") return reply.code(403).send({ message: "User has no active workspace" });
            return reply.code(500).send({ message: (e as unknown as { message: string })?.message });
        }
    }
);
