import { type FastifyInstance, type RouteOptions } from 'fastify';
import { healthCheckRoute } from './health-check';
import { workspaceRoutes } from './workspaces';
import { meRoute } from './users/me';
import { withPrefix } from '@lytos/constant-definitions';
import { authRoutes } from './auth';
import { customerRoutes } from './customers';
import { departmentRoutes } from './departments';

const routes: RouteOptions[] = [
    healthCheckRoute,
    meRoute,
    ...withPrefix('/workspaces', workspaceRoutes),
    ...withPrefix('/auth', authRoutes),
    ...withPrefix('/customers', customerRoutes),
    ...departmentRoutes
];

export const registerRoutes = (fastify: FastifyInstance) => {
    routes.map((route) => {
        fastify.route(route);
    });
};