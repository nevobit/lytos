import type { Conversation, Customer, Membership, User } from "@lytos/contracts";
import type { TimelineItem, TimelineItemType } from "./timeline.types";

type PopulatedMembership = Membership & { _id: unknown; userId?: User & { _id: unknown; name?: string } };
type PopulatedCustomer = Customer & { _id: unknown; displayName?: string; name?: string };
type PopulatedConversation = Conversation & { _id: unknown; channel?: Conversation["channel"] };

function resolveActor(input: {
    membership?: PopulatedMembership | string;
    customer?: PopulatedCustomer | string;
}): TimelineItem["actor"] {
    const { membership, customer } = input;

    const membershipId =
        membership && typeof membership !== "string"
            ? String(membership._id)
            : typeof membership === "string"
                ? membership
                : undefined;
    const customerId =
        customer && typeof customer !== "string"
            ? String(customer._id)
            : typeof customer === "string"
                ? customer
                : undefined;

    const membershipName =
        membership && typeof membership !== "string"
            ? membership.profile?.displayName?.trim() || membership.userId?.name || membership.inviteeEmail
            : undefined;
    const customerName =
        customer && typeof customer !== "string"
            ? customer.displayName || customer.name
            : undefined;

    if (membershipId) {
        return { type: "agent", id: membershipId, name: membershipName || "Agent" };
    }
    if (customerId) {
        return { type: "customer", id: customerId, name: customerName || "Customer" };
    }
    return { type: "system", name: "System" };
}

export function mapMessageTimelineItem(message: {
    _id: unknown;
    direction: "inbound" | "outbound" | "internal";
    createdAt?: Date | string;
    body?: { text?: string; html?: string };
    authorMembershipId?: PopulatedMembership | string;
    customerId?: PopulatedCustomer | string;
    conversationId?: PopulatedConversation | string;
}): TimelineItem {
    const type: TimelineItemType = message.direction === "internal" ? "note" : "message";

    return {
        id: String(message._id),
        type,
        createdAt: message.createdAt || new Date(0),
        actor: resolveActor({
            membership: message.authorMembershipId,
            customer: message.customerId,
        }),
        channel:
            message.conversationId && typeof message.conversationId !== "string"
                ? message.conversationId.channel
                : undefined,
        body: {
            text: message.body?.text,
            html: message.body?.html,
        },
    };
}

export function mapEventTimelineItem(event: {
    _id: unknown;
    type: string;
    title: string;
    metadata?: Record<string, unknown>;
    createdAt?: Date | string;
    actorMembershipId?: PopulatedMembership | string;
    actorCustomerId?: PopulatedCustomer | string;
}): TimelineItem {
    return {
        id: String(event._id),
        type: "event",
        createdAt: event.createdAt || new Date(0),
        actor: resolveActor({
            membership: event.actorMembershipId,
            customer: event.actorCustomerId,
        }),
        event: {
            code: event.type,
            title: event.title,
            metadata: event.metadata,
        },
    };
}
