import type { RouteOptions } from "fastify";
import { loginRoute } from "./login";
import { signupRoute } from "./signup";
import { switchWorkspaceRoute } from "./switch-workspace";

export const authRoutes: RouteOptions[] = [
    loginRoute,
    signupRoute,
    switchWorkspaceRoute
];