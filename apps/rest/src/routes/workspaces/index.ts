import type { RouteOptions } from "fastify";
import { createWorkspaceRoute } from "./create";
import { listWorkspaceRoute } from "./list";
import { deleteWorkspaceRoute } from "./delete";

export const workspaceRoutes: RouteOptions[] = [
    createWorkspaceRoute,
    listWorkspaceRoute,
    deleteWorkspaceRoute
];