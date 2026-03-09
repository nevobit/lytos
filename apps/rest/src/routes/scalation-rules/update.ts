import { authorizePermission, updateScalationRule } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import type { UpdateScalationRuleDto } from "@lytos/contracts";

export const updateScalationRuleRoute = makeFastifyRoute(
    RouteMethod.PATCH,
    "/:id",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const id = (req.params as { id: string }).id;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "scalation-rules.manage",
        });

        try {
            const dto = req.body as UpdateScalationRuleDto;
            const updated = await updateScalationRule(workspaceId, id, dto);
            return reply.code(200).send(updated);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Not found" });
            if (msg === "NAME_TAKEN") return reply.code(409).send({ message: "Rule name already exists" });
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid data" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
