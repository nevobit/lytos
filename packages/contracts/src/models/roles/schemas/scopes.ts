export interface Scopes {
    ticketsRead: TicketsReadScope;
    ticketsWrite: TicketsWriteScope;
    ticketsAssign: TicketsAssignScope;
    ticketsStatus?: TicketsStatusScope;
    ticketsMerge?: TicketsMergeScope;
    ticketsDelete?: TicketsDeleteScope;

    messagesRead?: MessagesReadScope;
    messagesSend?: MessagesSendScope;
    notesWrite?: NotesWriteScope;
    attachmentsRead?: AttachmentsReadScope;
    attachmentsWrite?: AttachmentsWriteScope;

    customersRead: CustomersReadScope;
    customersWrite?: CustomersWriteScope;
    customerNotes?: CustomerNotesScope;

    workspaceSettings?: WorkspaceSettingsScope;
    membersRead?: MembersReadScope;
    membersManage?: MembersManageScope;

    invitationsManage?: InvitationsManageScope;
    rolesManage?: RolesManageScope;
    departmentsManage?: DepartmentsManageScope;

    profileRead?: ProfileReadScope;
    profileWrite?: ProfileWriteScope;

    auditRead?: AuditReadScope;
    ticketEventsRead?: TicketEventsReadScope;

    emailAccountsManage?: EmailAccountsManageScope;
    emailSend?: EmailSendScope;

    widgetManage?: WidgetManageScope;
    visitorsRead?: VisitorsReadScope;

    kbRead?: KbReadScope;
    kbWrite?: KbWriteScope;
    kbPublish?: KbPublishScope;

    prioritiesManage?: PrioritiesManageScope;
    routingRulesManage?: RoutingRulesManageScope;
    slaManage?: SlaManageScope;
    businessHoursManage?: BusinessHoursManageScope;
    macrosManage?: MacrosManageScope;

    integrationsManage?: IntegrationsManageScope;
    integrationLogsRead?: IntegrationLogsReadScope;

    analyticsRead?: AnalyticsReadScope;
    savedViewsManage?: SavedViewsManageScope;

    callsManage?: CallsManageScope;
    remoteAssistManage?: RemoteAssistManageScope;

    csatManage?: CsatManageScope;
    csatRead?: CsatReadScope;
}


type ScopeLevelAll = "all";
type ScopeLevelDept = "department";
type ScopeLevelAssigned = "assigned";
type ScopeLevelOwn = "own";
export type ScopeLevel = ScopeLevelAll | ScopeLevelDept | ScopeLevelAssigned | ScopeLevelOwn;

type TicketsReadScope = "all" | "department" | "assigned";
type TicketsWriteScope = "all" | "department" | "assigned";
type TicketsAssignScope = "all" | "department";
type TicketsStatusScope = "all" | "department" | "assigned";
type TicketsMergeScope = "all" | "department";
type TicketsDeleteScope = "all";

type MessagesReadScope = "all" | "department" | "assigned";
type MessagesSendScope = "all" | "department" | "assigned";
type NotesWriteScope = "all" | "department" | "assigned";
type AttachmentsReadScope = "all" | "department" | "assigned";
type AttachmentsWriteScope = "all" | "department" | "assigned";

type CustomersReadScope = "all" | "department" | "assigned";
type CustomersWriteScope = "all" | "department";
type CustomerNotesScope = "all" | "department";

type WorkspaceSettingsScope = "all";
type MembersReadScope = "all" | "department";
type MembersManageScope = "all";

type InvitationsManageScope = "all";
type RolesManageScope = "all";
type DepartmentsManageScope = "all";

type ProfileReadScope = "all" | "own";
type ProfileWriteScope = "own";

type AuditReadScope = "all";
type TicketEventsReadScope = "all" | "department" | "assigned";

type EmailAccountsManageScope = "all";
type EmailSendScope = "all" | "department" | "assigned";

type WidgetManageScope = "all";
type VisitorsReadScope = "all" | "department";

type KbReadScope = "all";
type KbWriteScope = "all";
type KbPublishScope = "all";

type PrioritiesManageScope = "all";
type RoutingRulesManageScope = "all";
type SlaManageScope = "all";
type BusinessHoursManageScope = "all";
type MacrosManageScope = "all";

type IntegrationsManageScope = "all";
type IntegrationLogsReadScope = "all";

type AnalyticsReadScope = "all" | "department";
type SavedViewsManageScope = "all" | "own";

type CallsManageScope = "all" | "department" | "assigned";
type RemoteAssistManageScope = "all" | "department" | "assigned";

type CsatManageScope = "all";
type CsatReadScope = "all" | "department";
