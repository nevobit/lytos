import { invalidateCache } from "@/cache";
import { createWorkspace } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { Workspace } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";
import { slugify } from "@lytos/tools";

export const createWorkspaceRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/",
    verifyJwt,
    { tenant: "none", auth: "required" },
    async (request, reply) => {
        if (!request.auth?.userId) return reply.code(401).send({ message: "Unauthorized" });

        const body = request.body as Partial<Workspace>;

        if (!body || typeof body !== "object") {
            return reply.status(400).send({ message: "Invalid body" });
        }

        if (!body?.name || typeof body.name !== "string") {
            return reply.status(400).send({ message: "name is required" });
        }

        const name = body.name.trim();
        const timezone = body.timezone?.trim() || "America/Bogota";
        const locale = body.locale?.trim() || "es";

        const slug = body.slug ?? slugify(name);

        const ownerId = request.auth?.userId || 'unknown';

        const workspace = await createWorkspace({
            ...body,
            name,
            slug,
            timezone,
            locale,
            ownerId,
        });

        await invalidateCache(`workspaces:slug:${slug}`);
        await invalidateCache(`workspaces:list`);

        return reply.status(201).send(workspace);
    }
)