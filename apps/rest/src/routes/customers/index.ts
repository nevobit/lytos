import type { RouteOptions } from "fastify";
import { createCustomerRoute } from "./create";
import { getAllCustomersRoute } from "./list";

export const customerRoutes: RouteOptions[] = [
    createCustomerRoute,
    getAllCustomersRoute
];