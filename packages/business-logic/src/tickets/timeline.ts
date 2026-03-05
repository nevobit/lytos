import { Collection, getModel } from "@lytos/constant-definitions";
import {
    ConversationSchemaMongo,
    CustomerSchemaMongo,
    MembershipSchemaMongo,
    MessageSchemaMongo,
    TicketEventSchemaMongo,
    UserSchemaMongo,
} from "@lytos/contracts";
import type { Conversation, Customer, Membership, Message, TicketEvent, User } from "@lytos/contracts";
import { mapEventTimelineItem, mapMessageTimelineItem } from "./timeline.mappers";
import type { GetTicketTimelineParams, GetTicketTimelineResult, TimelineItem } from "./timeline.types";
export type { GetTicketTimelineParams, GetTicketTimelineResult, TimelineCursor, TimelineItem } from "./timeline.types";

function buildCursorFilter(cursor: { createdAt: string; id: string }) {
    const cursorDate = new Date(cursor.createdAt);
    return {
        $or: [
            { createdAt: { $lt: cursorDate } },
            { createdAt: cursorDate, _id: { $lt: cursor.id } },
        ],
    };
}

function sortTimelineDesc(a: TimelineItem, b: TimelineItem): number {
    const createdDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (createdDiff !== 0) return createdDiff;
    return b.id.localeCompare(a.id);
}

export const getTicketTimeline = async (params: GetTicketTimelineParams): Promise<GetTicketTimelineResult> => {
    const messageModel = getModel<Message>(Collection.MESSAGES, MessageSchemaMongo);
    const ticketEventModel = getModel<TicketEvent>(Collection.TICKET_EVENTS, TicketEventSchemaMongo);
    const conversationModel = getModel<Conversation>(Collection.CONVERSATIONS, ConversationSchemaMongo);
    const membershipModel = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);
    const userModel = getModel<User>(Collection.USERS, UserSchemaMongo);
    const customerModel = getModel<Customer>(Collection.CUSTOMERS, CustomerSchemaMongo);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);
    const fetchSize = limit + 1;

    const messageFilter: Record<string, unknown> = {
        workspaceId: params.workspaceId,
        ticketId: params.ticketId,
    };
    if (!params.includeInternal) {
        messageFilter.direction = { $ne: "internal" };
    }

    const eventFilter: Record<string, unknown> = {
        workspaceId: params.workspaceId,
        ticketId: params.ticketId,
    };
    if (!params.includeInternal) {
        eventFilter.$or = [
            { visibility: { $exists: false } },
            { visibility: { $ne: "internal" } },
        ];
    }

    if (params.cursor?.createdAt && params.cursor.id) {
        const cursorFilter = buildCursorFilter(params.cursor);

        messageFilter.$and = [...((messageFilter.$and as Record<string, unknown>[]) || []), cursorFilter];
        eventFilter.$and = [...((eventFilter.$and as Record<string, unknown>[]) || []), cursorFilter];
    }

    const [messages, events] = await Promise.all([
        messageModel
            .find(messageFilter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(fetchSize)
            .populate([
                {
                    path: "conversationId",
                    model: conversationModel,
                    select: "channel",
                },
                {
                    path: "authorMembershipId",
                    model: membershipModel,
                    select: "profile.displayName inviteeEmail userId",
                    populate: {
                        path: "userId",
                        model: userModel,
                        select: "name",
                    },
                },
                {
                    path: "customerId",
                    model: customerModel,
                    select: "displayName name",
                },
            ])
            .lean(),
        ticketEventModel
            .find(eventFilter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(fetchSize)
            .populate([
                {
                    path: "actorMembershipId",
                    model: membershipModel,
                    select: "profile.displayName inviteeEmail userId",
                    populate: {
                        path: "userId",
                        model: userModel,
                        select: "name",
                    },
                },
                {
                    path: "actorCustomerId",
                    model: customerModel,
                    select: "displayName name",
                },
            ])
            .lean(),
    ]);

    const messageItems: TimelineItem[] = messages.map((m) => mapMessageTimelineItem(m));
    const eventItems: TimelineItem[] = events.map((e) => mapEventTimelineItem(e));

    const mergedDesc = [...messageItems, ...eventItems].sort(sortTimelineDesc);

    const hasMore = mergedDesc.length > limit || messages.length > limit || events.length > limit;
    const pageDesc = mergedDesc.slice(0, limit);
    const items = [...pageDesc].reverse();
    const oldestItem = items[0];

    return {
        items,
        pageInfo: {
            hasMore,
            nextCursor: hasMore && oldestItem
                ? {
                    createdAt: new Date(oldestItem.createdAt).toISOString(),
                    id: oldestItem.id,
                }
                : null,
        },
    };
};
