import { authorizePermission, deleteTicketCategory } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const deleteTicketCategoryRoute = makeFastifyRoute(
    RouteMethod.DELETE,
    "/:id",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const { id } = req.params as { id: string };

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "ticket-categories.manage",
        });

        const out = await deleteTicketCategory(workspaceId, id);
        return reply.code(200).send(out);
    }
);