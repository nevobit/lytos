import { updateTicket } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { UpdateTicketDto } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const updateTicketRoute = makeFastifyRoute(
    RouteMethod.PATCH,
    "/:id",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as UpdateTicketDto;
        const ticket = await updateTicket(id, request.tenant!.slug!, body);
        if (!ticket) return reply.status(404).send({ message: "Ticket not found" });
        return reply.status(200).send(ticket);
    },
);
