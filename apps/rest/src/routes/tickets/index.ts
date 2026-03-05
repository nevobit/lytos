import type { RouteOptions } from "fastify";
import { createTicketRoute } from "./create";
import { getTicketByIdRoute } from "./get-by-id";
import { listTicketsRoute } from "./list";
import { updateTicketRoute } from "./update";
import { deleteTicketRoute } from "./delete";
import { getTicketTimelineRoute } from "./timeline";
import { createTicketMessageRoute } from "./messages";

export const ticketRoutes: RouteOptions[] = [
    createTicketRoute,
    getTicketTimelineRoute,
    getTicketByIdRoute,
    listTicketsRoute,
    updateTicketRoute,
    deleteTicketRoute,
    createTicketMessageRoute,
];
