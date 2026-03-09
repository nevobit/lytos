import { authorizePermission, updateTicketPriority } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import type { UpdateTicketPripertyDto } from "@lytos/contracts";

export const updateTicketPriorityRoute = makeFastifyRoute(
    RouteMethod.PATCH,
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
            const dto = req.body as UpdateTicketPripertyDto;
            const updated = await updateTicketPriority(workspaceId, id, dto);
            return reply.code(200).send(updated);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Not found" });
            if (msg === "NAME_TAKEN" || msg === "LEVEL_TAKEN")
                return reply.code(409).send({ message: "Priority already exists" });
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid data" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
