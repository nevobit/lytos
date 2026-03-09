import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, getWorkspaceInvitations } from "@lytos/business-logic";

export const listInvitationsRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "invitations.manage",
        });

        try {
            const invitations = await getWorkspaceInvitations(workspaceId);
            return reply.send(invitations);
        } catch {
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
