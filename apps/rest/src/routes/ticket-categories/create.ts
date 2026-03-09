import { authorizePermission, createTicketCategory } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import type { CreateTicketCategoryDto } from "@lytos/contracts";

export const createTicketCategoryRoute = makeFastifyRoute(
    RouteMethod.POST,
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
            permission: "ticket-categories.manage",
        });

        try {
            const dto = req.body as CreateTicketCategoryDto;
            const created = await createTicketCategory(workspaceId, dto);
            return reply.code(201).send(created);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid data" });
            if (msg === "NAME_TAKEN") return reply.code(409).send({ message: "Category name already exists" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);