import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { findUserById } from "@lytos/business-logic";

export const meRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/me",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        if (!request.auth) return;
        const user = await findUserById(request.auth?.userId)
        return reply.status(200).send(user);
    },
)