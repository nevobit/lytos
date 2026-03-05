import { createTicket } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { CreateTicketDto } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const createTicketRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const body = request.body as Omit<CreateTicketDto, "workspaceId" | "userId">;
        const { userId } = (request as { auth: { userId: string } }).auth;
        const ticket = await createTicket({ ...body, workspaceId: request.tenant!.workspaceId, userId });
        return reply.status(201).send(ticket);
    },
);
