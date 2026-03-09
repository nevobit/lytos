import { withPrefix } from "@lytos/constant-definitions";
import { listTicketStatusesRoute } from "./list";
import { createTicketStatusRoute } from "./create";
import { updateTicketStatusRoute } from "./update";
import { deleteTicketStatusRoute } from "./delete";

export const ticketStatusRoutes = withPrefix("/ticket-statuses", [
    listTicketStatusesRoute,
    createTicketStatusRoute,
    updateTicketStatusRoute,
    deleteTicketStatusRoute,
]);
