import type { RouteOptions } from "fastify";
import { loginRoute } from "./login";

export const authRoutes: RouteOptions[] = [
    loginRoute
];