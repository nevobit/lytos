import { Collection, getModel } from "@lytos/constant-definitions";
import { Invitation, InvitationSchemaMongo, Membership, MembershipSchemaMongo, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";

export const getAllWorkspaces = async (userId: string, email?: string) => {
    const membershipsModel = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);
    const workspacesModel = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    const invitationsModel = getModel<Invitation>(Collection.INVITATIONS, InvitationSchemaMongo)

    const memberships = await membershipsModel.find({ userId, lifecycleStatus: 'active' });

    const invitations = await invitationsModel.find({
        email,
        status: "pending",
        expiresAt: { $gt: new Date() },
    });

    const workspaceIds = Array.from(
        new Set([
            ...memberships.map((m) => String(m.workspaceId)),
            ...invitations.map((i) => String(i.workspaceId)),
        ])
    ).map((id) => id);


    const workspaces = await workspacesModel.find({ _id: { $in: workspaceIds } });
    const byId = new Map(workspaces.map((w) => [String(w.id), w]));

    const membershipsOut = memberships
        .map((m) => {
            const w = byId.get(String(m.workspaceId));
            if (!w) return null;
            return {
                membershipId: String(m.id),
                workspaceId: String(w.id),
                workspaceName: w.name,
                workspaceSlug: w.slug,
                roleId: String(m.roleId),
            };
        })
        .filter(Boolean)

    const invitationsOut = invitations
        .map((i) => {
            const w = byId.get(String(i.workspaceId));
            if (!w) return null;
            return {
                invitationId: String(i._id),
                workspaceId: String(w._id),
                workspaceName: w.name,
                workspaceSlug: w.slug,
                roleId: String(i.roleId),
                expiresAt: new Date(i.expiresAt).toISOString(),
            };
        })
        .filter(Boolean)

    return { memberships: membershipsOut, invitations: invitationsOut };
}