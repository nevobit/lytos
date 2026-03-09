import { authorizePermission, deleteTicketPriority } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const deleteTicketPriorityRoute = makeFastifyRoute(
    RouteMethod.DELETE,
    "/:id",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const id = (req.params as { id: string }).id;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "ticket-priorities.manage",
        });

        try {
            const out = await deleteTicketPriority(workspaceId, id);
            return reply.code(200).send(out);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Not found" });
            if (msg === "CANNOT_DELETE_DEFAULT")
                return reply.code(400).send({ message: "Cannot delete default priority" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
