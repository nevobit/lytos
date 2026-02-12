import { getAllWorkspaces } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const listWorkspaceRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (request, reply) => {
        if (!request.auth) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        const { userId } = request.auth;
        const workspaces = await getAllWorkspaces(userId);
        return reply.status(200).send(workspaces);
    }
)