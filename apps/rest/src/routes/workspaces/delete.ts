import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { deleteWorkspace } from "@lytos/business-logic";

export const deleteWorkspaceRoute = makeFastifyRoute(
    RouteMethod.DELETE,
    "/:id",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (req, reply) => {
        try {
            const id = String((req.params as { id: string }).id);
            const deleted = await deleteWorkspace(id);
            if (!deleted) return reply.code(404).send({ message: "Not found" });
            return reply.send({ success: true });
        } catch (e) {
            const msg = (e as { message?: string })?.message;
            if (msg === "BAD_REQUEST") return reply.code(400).send({ message: "Invalid ID" });
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
