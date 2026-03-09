export const DATA_SOURCES_KEY = 'dataSources';
export const MONGO_DATABASE_NAME = '@lytos';

export enum Collection {
    USERS = "users",
    WORKSPACES = "workspaces",
    MEMBERSHIPS = "memberships",
    ROLES = "roles",
    DEPARTMENTS = "departments",
    INVITATIONS = "invitations",
    SESSIONS = "sessions",
    AUDIT_LOGS = "auditLogs",

    TICKETS = "tickets",
    CONVERSATIONS = "conversations",
    MESSAGES = "messages",
    TICKET_EVENTS = "ticketEvents",
    TICKET_TASKS = "ticketTasks",
    TICKET_LINKS = "ticketLinks",
    ATTACHMENTS = "attachments",

    CUSTOMERS = "customers",
    CUSTOMER_NOTES = "customerNotes",
    CUSTOMER_SEGMENTS = "customerSegments",

    EMAIL_ACCOUNTS = "emailAccounts",
    WIDGET_CONFIGS = "widgetConfigs",
    VISITORS = "visitors",

    KB_CATEGORIES = "kbCategories",
    KB_ARTICLES = "kbArticles",
    KB_REVISIONS = "kbRevisions",
    KB_FEEDBACK = "kbFeedback",

    TICKET_PRIORITIES = "ticketPriorities",
    TICKET_CATEGORIES = "ticketCategories",
    TICKET_TYPES = "ticketTypes",
    TICKET_STATUSES = "ticketStatuses",

    ROUTING_RULES = "routingRules",
    SLA_POLICIES = "slaPolicies",
    SLA_BREACHES = "slaBreaches",
    ESCALATION_RULES = "escalationRules",
    BUSINESS_HOURS = "businessHours",
    MACROS = "macros",

    INTEGRATION_APPS = "integrationApps",
    INTEGRATIONS = "integrations",
    INTEGRATION_ACTIONS = "integrationActions",
    INTEGRATION_LOGS = "integrationLogs",

    CALLS = "calls",
    REMOTE_ASSIST_SESSIONS = "remoteAssistSessions",

    ANALYTICS_DAILY = "analyticsDaily",
    SAVED_VIEWS = "savedViews",

    CSAT_SURVEYS = "csatSurveys",
    CSAT_RESPONSES = "csatResponses",
}