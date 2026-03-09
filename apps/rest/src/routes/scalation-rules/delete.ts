import { authorizePermission, deleteScalationRule } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const deleteScalationRuleRoute = makeFastifyRoute(
    RouteMethod.DELETE,
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
            const out = await deleteScalationRule(workspaceId, id);
            return reply.code(200).send(out);
        } catch (e) {
            const msg = (e as { message: string })?.message;
            if (msg === "NOT_FOUND") return reply.code(404).send({ message: "Not found" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
