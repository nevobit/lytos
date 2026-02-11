import type { RouteOptions } from "fastify";
import { loginRoute } from "./login";
import { signupRoute } from "./signup";

export const authRoutes: RouteOptions[] = [
    loginRoute,
    signupRoute
];