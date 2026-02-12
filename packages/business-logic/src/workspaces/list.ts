import { Collection, getModel } from "@lytos/constant-definitions";
import { Membership, MembershipSchemaMongo, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";

export const getAllWorkspaces = async (userId: string, email?: string) => {
    const membershipsModel = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);
    const workspacesModel = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);

    const activeMemberships = await membershipsModel
        .find({ userId, status: "active" });

    const invitationsQuery: { userId?: string, status: string, inviteeEmail?: string }[] = [{ userId, status: "invited" }];
    if (email) invitationsQuery.push({ inviteeEmail: email, status: "invited" });

    const invitations = await membershipsModel
        .find({ $or: invitationsQuery })

    const workspaceIds = Array.from(
        new Set([...activeMemberships, ...invitations].map((m) => m.workspaceId))
    );

    const workspaces = await workspacesModel
        .find({ _id: { $in: workspaceIds } });


    const byId = new Map(workspaces.map((w) => [w.id, w]));

    const memberships = activeMemberships
        .map((m) => {
            const w = byId.get(m.workspaceId);
            if (!w) return null;
            return {
                membershipId: m.id,
                workspaceId: w.id,
                workspaceName: w.name,
                workspaceSlug: w.slug,
                roleId: m.roleId,
                status: "active" as const,
            };
        })
        .filter(Boolean);

    const invitationsOut = invitations
        .map((m) => {
            const w = byId.get(m.workspaceId);
            if (!w) return null;
            return {
                membershipId: m.id,
                workspaceId: w.id,
                workspaceName: w.name,
                workspaceSlug: w.slug,
                invitedAt: (m.invitedAt ?? new Date()).toISOString(),
                status: "invited" as const,
            };
        })
        .filter(Boolean);


    return { memberships, invitations: invitationsOut };
}