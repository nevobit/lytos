import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const meRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/me",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        return reply.status(200).send({
            tenant: {
                // workspaceId: request.tenant.workspaceId,
                // slug: request.tenant.slug,
                // resolvedBy: request.tenant.mode,
            },

            user: null,
            permissions: [],
        });
    },
)