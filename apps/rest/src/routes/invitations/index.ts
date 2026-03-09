import { listInvitationsRoute } from "./list";
import { createInvitationRoute } from "./create";
import { revokeInvitationRoute } from "./revoke";

export const invitationRoutes = [
    listInvitationsRoute,
    createInvitationRoute,
    revokeInvitationRoute,
];
