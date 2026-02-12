import { authorizePermission, getAllDepartments } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Params } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const listDepartmentsRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const { params } = req as { params: Params };
        const wsId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;

        if (!wsId || !roleId) return reply.code(409).send({ message: "Workspace context required" });

        await authorizePermission({ workspaceId: wsId, roleId, permission: "departments.read" });

        const out = await getAllDepartments({ ...params, workspaceId: wsId });
        return reply.code(200).send(out);
    }
);
