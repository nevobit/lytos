import { authorizePermission, setDefaultDepartment } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

export const setDefaultDepartmentRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/:departmentId/set-default",
    null,
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
            const updated = await setDefaultDepartment(workspaceId, departmentId);

            return reply.code(200).send(updated);
        } catch (e) {
            const msg = (e as { message: string })?.message;

            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Department not found" });

            return reply.code(500).send({ message: "Server error" });
        }
    }
);
