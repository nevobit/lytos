import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, getAllRoles } from "@lytos/business-logic";

export const listRolesRoute = makeFastifyRoute(
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
            permission: "roles.manage",
        });

        const params = req.query as { workspaceId: string };
        params.workspaceId = workspaceId;

        try {
            const out = await getAllRoles(params);
            return reply.send(out);
        } catch {
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
