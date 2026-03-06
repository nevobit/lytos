import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Params } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";
import { getAllMembershipUsers } from "../../../../../packages/business-logic/src/memberships";

export const listUsersRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const { params } = req as { params: Params };
        const wsId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;

        if (!wsId || !roleId) return reply.code(409).send({ message: "User context required" });

        const out = await getAllMembershipUsers({ ...params, workspaceId: wsId });
        return reply.code(200).send(out);
    }
);


