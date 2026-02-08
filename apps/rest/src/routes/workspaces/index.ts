import type { RouteOptions } from "fastify";
import { createWorkspaceRoute } from "./create";

export const workspaceRoutes: RouteOptions[] = [
    createWorkspaceRoute,
];