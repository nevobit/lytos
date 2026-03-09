import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, deleteTicketStatus } from "@lytos/business-logic";

export const deleteTicketStatusRoute = makeFastifyRoute(
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
            permission: "ticket-statuses.manage",
        });

        try {
            const id = String((req.params as { id: string }).id);
            const deleted = await deleteTicketStatus(workspaceId, id);
            if (!deleted) return reply.code(404).send({ message: "Not found" });
            return reply.send({ success: true });
        } catch (e) {
            const msg = (e as { message?: string })?.message;
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid ID" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
