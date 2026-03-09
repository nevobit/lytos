import { withPrefix } from "@lytos/constant-definitions";
import { listTicketPrioritiesRoute } from "./list";
import { createTicketPriorityRoute } from "./create";
import { updateTicketPriorityRoute } from "./update";
import { deleteTicketPriorityRoute } from "./delete";

export const ticketPriorityRoutes = withPrefix("/ticket-priorities", [
    listTicketPrioritiesRoute,
    createTicketPriorityRoute,
    updateTicketPriorityRoute,
    deleteTicketPriorityRoute,
]);
