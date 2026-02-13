import { authorizePermission, listTickets } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Params } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const listTicketsRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const query = request.params as Omit<Params, "workspaceId">;

        const wsId = request.auth?.workspaceId;
        const roleId = request.auth?.roleId;

        if (!wsId || !roleId) return reply.code(409).send({ message: "Workspace context required" });

        await authorizePermission({ workspaceId: wsId, roleId, permission: "departments.read" });

        const tickets = await listTickets({
            ...query,
            workspaceId: wsId,
        });
        return reply.status(200).send(tickets);
    },
);
