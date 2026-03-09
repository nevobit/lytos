import { createCustomer } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { CreateCustomerDto } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const createCustomerRoute = makeFastifyRoute(
    RouteMethod.POST,
    '/',
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const body = request.body as CreateCustomerDto;
        const { userId } = (request as { auth: { userId: string } }).auth;
        const customer = await createCustomer({ ...body, workspaceId: request.tenant!.workspaceId, userId });
        return reply.status(201).send(customer);
    }
)