import { switchWorkspace } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const switchWorkspaceRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/switch-workspace",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (req, reply) => {
        const userId = req.auth?.userId || 'unknown';

        const data = req.body as {
            membershipId: string;
            workspaceId: string;
        }

        try {
            const out = await switchWorkspace(
                userId,
                data.workspaceId,
                data.membershipId
            );
            return reply.code(200).send(out);
        } catch (e) {
            if ((e as unknown as { message: string })?.message === "INVALID_CREDENTIALS") return reply.code(401).send({ message: "Invalid credentials" });
            if ((e as unknown as { message: string })?.message === "NO_WORKSPACE") return reply.code(403).send({ message: "User has no active workspace" });
            return reply.code(500).send({ message: (e as unknown as { message: string })?.message });
        }
    }
);

