import { signup } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { CreateUserDto } from "@lytos/contracts";

interface Headers {
    "user-agent": string;
};
export const signupRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/signup",
    null,
    { tenant: "none", auth: "none" },
    async (req, reply) => {
        const { body, headers } = req as { body: CreateUserDto, headers: Headers };
        try {
            const data: CreateUserDto = {
                ...body,
                userAgent: headers['user-agent']
            }
            const out = await signup(data);
            return reply.code(200).send(out);
        } catch (e) {
            if ((e as unknown as { message: string })?.message === "INVALID_CREDENTIALS") return reply.code(401).send({ message: "Invalid credentials" });
            if ((e as unknown as { message: string })?.message === "NO_WORKSPACE") return reply.code(403).send({ message: "User has no active workspace" });
            return reply.code(500).send({ message: (e as unknown as { message: string })?.message });
        }
    }
);
