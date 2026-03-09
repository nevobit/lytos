import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, deleteRole } from "@lytos/business-logic";

export const deleteRoleRoute = makeFastifyRoute(
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
            permission: "roles.manage",
        });

        try {
            const id = String((req.params as { id: string }).id);
            const out = await deleteRole(workspaceId, id);
            return reply.send(out);
        } catch {
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
