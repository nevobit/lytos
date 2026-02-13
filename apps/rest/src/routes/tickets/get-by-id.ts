import { findTicketById } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const getTicketByIdRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/:id",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const { id } = request.params as { id: string };
        const ticket = await findTicketById(id, request.tenant!.slug!);
        if (!ticket) return reply.status(404).send({ message: "Ticket not found" });
        return reply.status(200).send(ticket);
    },
);
