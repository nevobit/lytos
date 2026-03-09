import type { RouteOptions } from "fastify";
import { loginRoute } from "./login";
import { signupRoute } from "./signup";
import { switchWorkspaceRoute } from "./switch-workspace";
import { loginGoogleRoute } from "./login-google";

export const authRoutes: RouteOptions[] = [
    loginRoute,
    loginGoogleRoute,
    signupRoute,
    switchWorkspaceRoute
];