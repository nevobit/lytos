import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, revokeInvitation } from "@lytos/business-logic";

export const revokeInvitationRoute = makeFastifyRoute(
    RouteMethod.DELETE,
    "/:id",
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
            const id = String((req.params as { id: string }).id);
            const inv = await revokeInvitation(id);
            if (!inv) return reply.code(404).send({ message: "Invitation not found" });
            return reply.send(inv);
        } catch {
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
