import { getAllCustomers } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Params } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const getAllCustomersRoute = makeFastifyRoute(
    RouteMethod.GET,
    '/',
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const { params } = request as { params: Params };
        const customers = await getAllCustomers({ ...params, workspaceId: request.tenant!.workspaceId });
        return reply.status(200).send(customers);
    }
)