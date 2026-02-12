import type { RouteOptions } from "fastify";
import { createTicketRoute } from "./create";
import { getTicketByIdRoute } from "./get-by-id";
import { listTicketsRoute } from "./list";
import { updateTicketRoute } from "./update";
import { deleteTicketRoute } from "./delete";

export const ticketRoutes: RouteOptions[] = [
    createTicketRoute,
    getTicketByIdRoute,
    listTicketsRoute,
    updateTicketRoute,
    deleteTicketRoute,
];
