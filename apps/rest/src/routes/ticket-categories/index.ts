import { listTicketCategoriesRoute } from "./list";
import { createTicketCategoryRoute } from "./create";
import { updateTicketCategoryRoute } from "./update";
import { deleteTicketCategoryRoute } from "./delete";
import { withPrefix } from "@lytos/constant-definitions";

export const ticketCategoryRoutes = withPrefix("/ticket-categories", [
    listTicketCategoriesRoute,
    createTicketCategoryRoute,
    updateTicketCategoryRoute,
    deleteTicketCategoryRoute,
]);