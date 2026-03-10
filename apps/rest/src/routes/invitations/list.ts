import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { getWorkspaceInvitations } from "@lytos/business-logic";

export const listInvitationsRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (request, reply) => {
        if (!request.auth) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        const { userId } = request.auth;

        try {
            const invitations = await getWorkspaceInvitations(userId);
            return reply.send(invitations);
        } catch {
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
