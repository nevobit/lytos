import { type FastifyInstance, type RouteOptions } from 'fastify';
import { healthCheckRoute } from './health-check';
import { workspaceRoutes } from './workspaces';
import { meRoute } from './users/me';
import { withPrefix } from '@lytos/constant-definitions';
import { authRoutes } from './auth';
import { customerRoutes } from './customers';
import { departmentRoutes } from './departments';
import { scalationRuleRoutes } from './scalation-rules';
import { ticketPriorityRoutes } from './ticket-priorities';
import { ticketCategoryRoutes } from './ticket-categories';
import { ticketTypeRoutes } from './ticket-types';
import { ticketRoutes } from './tickets';
import { userRoutes } from './users';
import { invitationRoutes } from './invitations';

const routes: RouteOptions[] = [
    healthCheckRoute,
    meRoute,
    ...withPrefix('/workspaces', workspaceRoutes),
    ...withPrefix('/auth', authRoutes),
    ...withPrefix('/customers', customerRoutes),
    ...departmentRoutes,
    ...scalationRuleRoutes,
    ...ticketPriorityRoutes,
    ...ticketCategoryRoutes,
    ...ticketTypeRoutes,
    ...withPrefix('/tickets', ticketRoutes),
    ...userRoutes,
    ...withPrefix('/invitations', invitationRoutes)

];

export const registerRoutes = (fastify: FastifyInstance) => {
    routes.map((route) => {
        fastify.route(route);
    });
};