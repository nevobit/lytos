import { type Base } from '../../../common';

interface Branding {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
}

interface Plan {
    name: "free" | "pro" | "enterprise";
    seatsLimit: number;
    channelsEnabled: ("email" | "widget" | "whatsapp" | "webchat" | "calls")[]
}

interface Settings {
    ticketNumberPrefix: string;
    allowReopenClosed: boolean;
    defaultTicketStatus: "open" | "pending" | "closed";
    defaultPropertyId?: string;
    defaultDeparmentId?: string;
    businessHoursId?: string;
}

interface Domain {
    customDomains?: string[];
    allowedOrigins?: string[];
}

export interface Workspace extends Base {
    name: string;
    slug: string;
    timezone: string;
    locale: string;

    branding?: Branding;

    plan: Plan;

    settings?: Settings;

    domains?: Domain[];

    ownerId: string;
}