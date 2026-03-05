import { authorizePermission, createMessageWithEvent } from "@lytos/business-logic";
import { Collection, getModel } from "@lytos/constant-definitions";
import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { ConversationSchemaMongo, LifecycleStatus, TicketSchemaMongo } from "@lytos/contracts";
import type { Conversation, Ticket } from "@lytos/contracts";
import { verifyJwt } from "@lytos/security";

export const createTicketMessageRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/:id/messages",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (request, reply) => {
        const { id: ticketId } = request.params as { id: string };
        const body = request.body as {
            mode: "public" | "internal";
            body: string;
            conversationId?: string;
        };

        const workspaceId = request.auth?.workspaceId;
        const roleId = request.auth?.roleId;
        const claims = request.auth?.claims;
        const membershipId =
            claims && typeof claims === "object" && "kind" in claims && claims.kind === "workspace" && "membershipId" in claims
                ? (claims as { membershipId: string }).membershipId
                : undefined;

        if (!workspaceId || !roleId || !membershipId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        if (!body.mode || (body.mode !== "public" && body.mode !== "internal")) {
            return reply.code(400).send({ message: "mode must be 'public' or 'internal'" });
        }

        if (!body.body || typeof body.body !== "string" || body.body.trim().length === 0) {
            return reply.code(400).send({ message: "body is required and must not be empty" });
        }

        if (body.body.length > 10000) {
            return reply.code(400).send({ message: "body must not exceed 10000 characters" });
        }

        const permission = body.mode === "public" ? "messages.send" : "notes.write";
        await authorizePermission({ workspaceId, roleId, permission });

        const ticketModel = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
        const conversationModel = getModel<Conversation>(Collection.CONVERSATIONS, ConversationSchemaMongo);
        const session = await ticketModel.db.startSession();

        let result: Awaited<ReturnType<typeof createMessageWithEvent>> | null = null;

        try {
            await session.withTransaction(async (session) => {
                const ticket = await ticketModel.findOne(
                    {
                        _id: ticketId,
                        workspaceId,
                        lifecycleStatus: { $ne: LifecycleStatus.DELETED },
                    },
                    null,
                    { session },
                );

                if (!ticket) {
                    throw new Error("TICKET_NOT_FOUND");
                }

                let conversationId = body.conversationId;
                let conversation: Conversation | null = null;

                if (conversationId) {
                    conversation = await conversationModel.findOne(
                        {
                            _id: conversationId,
                            workspaceId,
                            ticketId,
                            lifecycleStatus: { $ne: LifecycleStatus.DELETED },
                        },
                        null,
                        { session },
                    );

                    if (!conversation) {
                        throw new Error("CONVERSATION_NOT_FOUND");
                    }
                } else {
                    conversation = await conversationModel.findOne(
                        {
                            workspaceId,
                            ticketId,
                            type: "main",
                            lifecycleStatus: { $ne: LifecycleStatus.DELETED },
                        },
                        null,
                        { session },
                    );

                    if (!conversation) {
                        throw new Error("MAIN_CONVERSATION_NOT_FOUND");
                    }

                    conversationId = String(conversation._id || conversation.id);
                }

                if (conversation.status === "closed") {
                    throw new Error("CONVERSATION_CLOSED");
                }

                result = await createMessageWithEvent({
                    workspaceId,
                    ticketId,
                    conversationId,
                    authorMembershipId: membershipId,
                    mode: body.mode,
                    body: body.body,
                    session,
                });
            });

            if (!result) {
                return reply.code(500).send({ message: "Failed to create message" });
            }

            return reply.code(201).send({
                id: String(result.message._id || result.message.id),
                type: result.message.kind === "note" ? "note" : "message",
                createdAt: result.message.createdAt,
                actor: {
                    type: "agent",
                    id: result.message.authorMembershipId,
                    name: "Agent", // Could be populated if needed
                },
                channel: result.conversation.channel,
                body: {
                    text: result.message.body?.text,
                    html: result.message.body?.html,
                },
            });
        } catch (error) {
            const message = (error as { message?: string })?.message || "Internal server error";
            const statusCode =
                message === "TICKET_NOT_FOUND"
                    ? 404
                    : message === "CONVERSATION_NOT_FOUND" || message === "MAIN_CONVERSATION_NOT_FOUND"
                        ? 404
                        : message === "CONVERSATION_CLOSED"
                            ? 400
                            : message === "FORBIDDEN"
                                ? 403
                                : 500;

            return reply.code(statusCode).send({ message });
        } finally {
            await session.endSession();
        }
    },
);
