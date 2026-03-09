import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission, updateTicketStatus } from "@lytos/business-logic";
import type { UpdateTicketStatusDto } from "@lytos/contracts";

export const updateTicketStatusRoute = makeFastifyRoute(
    RouteMethod.PUT,
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
            const dto = req.body as UpdateTicketStatusDto;
            const updated = await updateTicketStatus(workspaceId, id, dto);
            if (!updated) return reply.code(404).send({ message: "Not found" });
            return reply.send(updated);
        } catch (e) {
            const msg = (e as { message?: string })?.message;
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid data" });
            if (msg === "NAME_TAKEN") return reply.code(409).send({ message: "Name already exists" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
