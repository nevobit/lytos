import { authorizePermission, updateDepartment } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";

type UpdateDepartmentDto = {
    name?: string;
    slug?: string;
    description?: string;
    leadMembershipIds?: string[];
};

export const updateDepartmentRoute = makeFastifyRoute(
    RouteMethod.PATCH,
    "/:departmentId",
    null,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const { departmentId } = req.params as { departmentId: string }

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "departments.manage",
        });

        try {
            const dto = req.body as UpdateDepartmentDto;

            const updated = await updateDepartment(workspaceId, departmentId, dto);

            return reply.code(200).send(updated);
        } catch (e) {
            const msg = (e as { message: string })?.message;

            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Department not found" });
            if (msg === "SLUG_TAKEN") return reply.code(409).send({ message: "Slug already exists" });

            return reply.code(500).send({ message: "Server error" });
        }
    }
);
