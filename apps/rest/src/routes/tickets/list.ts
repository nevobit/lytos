import { listTickets } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Params } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const listTicketsRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const query = request.query as Omit<Params, "workspaceId">;
        const tickets = await listTickets({
            ...query,
            workspaceId: request.tenant!.slug!,
        });
        return reply.status(200).send(tickets);
    },
);
