import { Collection, getModel } from "@lytos/constant-definitions";
import {
    ConversationSchemaMongo,
    LifecycleStatus,
    MessageSchemaMongo,
    TicketEventSchemaMongo,
} from "@lytos/contracts";
import type { Conversation, CreateMessageDto, CreateTicketEventDto, Message, TicketEvent } from "@lytos/contracts";

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

function textToHtml(text: string): string {
    return escapeHtml(text).replace(/\n/g, "<br>");
}

export interface CreateMessageInput {
    workspaceId: string;
    ticketId: string;
    conversationId: string;
    authorMembershipId: string;
    mode: "public" | "internal";
    body: string;
    session?: unknown; // Mongoose ClientSession - typed as unknown to avoid dependency on mongoose types
}

export interface CreateMessageResult {
    message: Message;
    event: TicketEvent;
    conversation: {
        id: string;
        channel: Conversation["channel"];
    };
}

export const createMessageWithEvent = async (
    input: CreateMessageInput,
): Promise<CreateMessageResult> => {
    const messageModel = getModel<Message>(Collection.MESSAGES, MessageSchemaMongo);
    const ticketEventModel = getModel<TicketEvent>(Collection.TICKET_EVENTS, TicketEventSchemaMongo);
    const conversationModel = getModel<Conversation>(Collection.CONVERSATIONS, ConversationSchemaMongo);

    const direction = input.mode === "public" ? "outbound" : "internal";
    const kind = input.mode === "public" ? "message" : "note";
    const eventType = input.mode === "public" ? "message.sent" : "note.added";
    const eventVisibility = input.mode === "public" ? ("public" as const) : ("internal" as const);

    const text = input.body.trim();
    const html = textToHtml(text);

    const messageData: CreateMessageDto = {
        workspaceId: input.workspaceId,
        ticketId: input.ticketId,
        conversationId: input.conversationId,
        direction,
        kind,
        body: {
            text,
            html,
        },
        authorMembershipId: input.authorMembershipId,
    };

    const eventData: CreateTicketEventDto = {
        workspaceId: input.workspaceId,
        ticketId: input.ticketId,
        type: eventType,
        title: input.mode === "public" ? "Message sent" : "Note added",
        actorMembershipId: input.authorMembershipId,
        visibility: eventVisibility,
        metadata: {
            messageId: "", // Will be set after message creation
        },
    };

    // Create message with session if provided
    const createOptions = input.session ? { session: input.session } : {};
    const [createdMessage] = await messageModel.create([messageData], createOptions);

    if (!createdMessage) {
        throw new Error("MESSAGE_CREATE_FAILED");
    }

    eventData.metadata.messageId = String(createdMessage._id || createdMessage.id);

    // Create event with session if provided
    const [createdEvent] = await ticketEventModel.create([eventData], createOptions);

    if (!createdEvent) {
        throw new Error("EVENT_CREATE_FAILED");
    }

    const conversation = await conversationModel
        .findOne({
            _id: input.conversationId,
            workspaceId: input.workspaceId,
            lifecycleStatus: { $ne: LifecycleStatus.DELETED },
        })
        .select("_id channel")
        .lean();

    if (!conversation) {
        throw new Error("CONVERSATION_NOT_FOUND");
    }

    return {
        message: createdMessage,
        event: createdEvent,
        conversation: {
            id: String(conversation._id),
            channel: conversation.channel,
        },
    };
};
