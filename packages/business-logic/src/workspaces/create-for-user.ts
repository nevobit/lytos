import { createWorkspace, generateTicketPrefixFromSlug, normalizeTicketPrefix } from "../workspaces";
import { createMembership } from "../memberships";
import { findRoleByKeyOrName } from "../roles";
import { CreateWorkspaceDto, Membership } from "@lytos/contracts";

export type WorkspaceOnboardingOutput = {
    workspace: { id: string; slug: string; name: string };
    membership: Membership;
};

export async function createWorkspaceForUser(
    userId: string,
    input: CreateWorkspaceDto,
): Promise<WorkspaceOnboardingOutput> {
    if (!input.name || !input.slug) throw new Error("INVALID_INPUT");

    const ticketNumberPrefix =
        normalizeTicketPrefix(input?.settings?.ticketNumberPrefix) ??
        generateTicketPrefixFromSlug(input.slug);

    const workspace = await createWorkspace({
        name: input.name,
        slug: input.slug,
        timezone: input.timezone ?? "America/Bogota",
        settings: {
            ticketNumberPrefix,
            defaultTicketStatus: "open",
            allowReopenClosed: true,
        },
        plan: { name: 'free', seatsLimit: 3, channelsEnabled: ['email'] },
        locale: input.locale,
        ownerId: input.ownerId
    });

    const ownerRole = await findRoleByKeyOrName("owner");
    if (!ownerRole) throw new Error("OWNER_ROLE_NOT_FOUND");

    const membership = await createMembership({
        userId,
        workspaceId: workspace.id,
        roleId: ownerRole.id,
        status: "active",
        departmentIds: [],
        title: ""
    });

    return {
        workspace: { id: workspace.id, slug: workspace.slug, name: workspace.name },
        membership,
    };
}
