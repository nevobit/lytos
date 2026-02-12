import type { RouteOptions } from "fastify";
import { createWorkspaceRoute } from "./create";
import { listWorkspaceRoute } from "./list";

export const workspaceRoutes: RouteOptions[] = [
    createWorkspaceRoute,
    listWorkspaceRoute
];