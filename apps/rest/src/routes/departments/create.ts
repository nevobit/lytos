import { authorizePermission, createDepartment } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

type CreateDepartmentDto = {
    name: string;
    slug?: string;
    description?: string;
    leadMembershipIds?: string[];
    primaryLeadMembershipId: string;
};

export const createDepartmentRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "departments.manage",
        });

        try {
            const dto = req.body as CreateDepartmentDto;

            const created = await createDepartment(workspaceId, dto);

            return reply.code(201).send(created);
        } catch (e) {
            const msg = (e as { message: string })?.message;

            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid data" });
            if (msg === "SLUG_TAKEN") return reply.code(409).send({ message: "Slug already exists" });

            return reply.code(500).send({ message: "Server error" });
        }
    }
);
