import { Base } from '../../../common';

interface Source {
    channel: "email" | "widget" | "webchat" | "whatsapp" | "call" | "manual"
    emailAccountId?: string;
    widgetId?: string;
}

interface Metrics {
    firstResponseAt?: Date;
    firstResponseByMembershipId?: string;
    lastMessageAt?: Date;
    solvedAt?: Date;
    closedAt?: Date;
    reopenedCount: number;
}

interface SLA {
    policyId?: string;
    nextBreachAt?: Date
    breached: boolean
}

interface Links {
    mergedIntoTicketId?: string;
}
export interface Ticket extends Base {
    title: string;
    ticketNumber: string

    subject: string
    description?: string

    status: "open" | "pending" | "solved" | "closed"

    priorityId?: string;
    categoryId?: string;
    departmentId?: string;
    assigneeMembershipId?: string;
    customerId: string;

    workspaceId: string;
    userId: string;

    source: Source;

    tags: string[];

    metrics: Metrics;

    sla?: SLA;

    links?: Links;
}
