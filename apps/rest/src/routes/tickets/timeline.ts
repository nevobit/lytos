import { authorizePermission, getTicketTimeline } from "@lytos/business-logic";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";

export const getTicketTimelineRoute = makeFastifyRoute(
    RouteMethod.GET,
    "/:id/timeline",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const { id } = request.params as { id: string };
        const query = request.query as {
            limit?: string | number;
            cursorCreatedAt?: string;
            cursorId?: string;
        };
        const workspaceId = request.auth?.workspaceId;
        const roleId = request.auth?.roleId;

        if (!workspaceId || !roleId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({ workspaceId, roleId, permission: "tickets.read" });

        let includeInternal = true;
        try {
            await authorizePermission({ workspaceId, roleId, permission: "notes.write" });
        } catch {
            includeInternal = false;
        }

        const timeline = await getTicketTimeline({
            workspaceId,
            ticketId: id,
            includeInternal,
            limit: query.limit ? Number(query.limit) : undefined,
            cursor:
                query.cursorCreatedAt && query.cursorId
                    ? {
                        createdAt: query.cursorCreatedAt,
                        id: query.cursorId,
                    }
                    : undefined,
        });

        reply.header("x-timeline-has-more", String(timeline.pageInfo.hasMore));
        if (timeline.pageInfo.nextCursor) {
            reply.header("x-timeline-next-cursor-created-at", timeline.pageInfo.nextCursor.createdAt);
            reply.header("x-timeline-next-cursor-id", timeline.pageInfo.nextCursor.id);
        }

        return reply.code(200).send(timeline.items);
    },
);
