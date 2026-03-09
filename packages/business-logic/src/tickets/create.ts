import { Collection, getModel } from "@lytos/constant-definitions";
import { ConversationSchemaMongo, LifecycleStatus, TicketSchemaMongo, WorkspaceSchemaMongo } from "@lytos/contracts";
import type { Conversation, CreateTicketDto, Ticket, Workspace } from "@lytos/contracts";

function mapTicketSourceToConversationChannel(
    channel: CreateTicketDto["source"]["channel"],
): Conversation["channel"] {
    switch (channel) {
        case "email":
        case "webchat":
        case "whatsapp":
        case "widget":
            return channel;
        case "call":
        case "manual":
            return "internal";
        default:
            return "internal";
    }
}

export const createTicket = async (data: CreateTicketDto): Promise<Ticket | null> => {
    const ticketModel = getModel<Ticket>(Collection.TICKETS, TicketSchemaMongo);
    const workspaceModel = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    const conversationModel = getModel<Conversation>(Collection.CONVERSATIONS, ConversationSchemaMongo);

    let createdTicket: Ticket | null = null;

    const workspace = await workspaceModel.findById(data.workspaceId);
    const tickets = await ticketModel.countDocuments();


    const ticketNumber = (workspace?.settings?.ticketNumberPrefix || "LY") + "-" + (tickets + 100).toLocaleString();
    const created = await ticketModel.create(
        [{ ...data, ticketNumber, lifecycleStatus: LifecycleStatus.ACTIVE }],
    );
    const ticket = created[0];
    if (!ticket) {
        throw new Error("TICKET_CREATE_FAILED");
    }
    createdTicket = ticket;

    const ticketId =
        (ticket as unknown as { id?: string; _id?: string }).id ??
        (ticket as unknown as { _id?: string })._id;

    if (!ticketId) {
        throw new Error("TICKET_ID_MISSING");
    }

    await conversationModel.create(
        [
            {
                workspaceId: data.workspaceId,
                ticketId,
                type: "main",
                channel: mapTicketSourceToConversationChannel(data.source.channel),
                participants: {
                    customers: [data.customerId],
                    agents: data.assigneeMembershipId ? [data.assigneeMembershipId] : [],
                },
                subject: data.subject,
                status: "open",
                lifecycleStatus: LifecycleStatus.ACTIVE,
            },
        ],
    );

    return createdTicket;
};
