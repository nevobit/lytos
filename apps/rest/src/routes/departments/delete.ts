import { authorizePermission, deleteDepartment } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const deleteDepartmentRoute = makeFastifyRoute(
    RouteMethod.DELETE,
    "/:departmentId",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const departmentId = (req.params as { departmentId: string }).departmentId as string;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "departments.manage",
        });

        try {
            await deleteDepartment(workspaceId, departmentId);

            return reply.code(204).send();
        } catch (e) {
            const msg = (e as { message: string })?.message;

            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Department not found" });
            if (msg === "CANNOT_DELETE_DEFAULT") return reply.code(409).send({ message: "Cannot delete default department" });

            return reply.code(500).send({ message: "Server error" });
        }
    }
);
