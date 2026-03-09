import { withPrefix } from "@lytos/constant-definitions";
import { listTicketTypesRoute } from "./list";
import { createTicketTypeRoute } from "./create";
import { updateTicketTypeRoute } from "./update";
import { deleteTicketTypeRoute } from "./delete";

export const ticketTypeRoutes = withPrefix("/ticket-types", [
    listTicketTypesRoute,
    createTicketTypeRoute,
    updateTicketTypeRoute,
    deleteTicketTypeRoute,
]);
