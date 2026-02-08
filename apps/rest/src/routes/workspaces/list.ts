import { invalidateCache } from "@/cache";
import { createWorkspace } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import type { CreateWorkspaceDto } from "@lytos/contracts";
import { slugify } from "@lytos/tools";

export const listWorkspaceRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/workspaces",
    null,
    { tenant: "none", auth: "none" },
    async (request, reply) => {
        const body = request.body as CreateWorkspaceDto;

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