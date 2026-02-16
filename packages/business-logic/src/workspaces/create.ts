import { Collection, getModel } from "@lytos/constant-definitions";
import { type Membership, MembershipSchemaMongo, type Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";
import { seedWorkspaceRoles } from "../roles";
import { seedDefaultDepartment } from "../departments";

export function generateTicketPrefixFromSlug(slug: string) {
    const letters = slug.replace(/[^a-z0-9]/g, "").toUpperCase();
    return (letters.slice(0, 4) || "LYT").toUpperCase();
}

export function normalizeTicketPrefix(prefix?: string) {
    if (!prefix) return null;
    const p = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!p) return null;
    if (p.length < 2 || p.length > 6) return null;
    return p;
}

export const createWorkspace = async (workspaceData: Partial<Workspace>) => {
    const workspaces = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    const memberships = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);


    const ticketNumberPrefix =
        normalizeTicketPrefix(workspaceData?.settings?.ticketNumberPrefix) ??
        generateTicketPrefixFromSlug(workspaceData.slug || '');

    const workspace = new workspaces({ ...workspaceData, settings: { ...workspaceData.settings, ticketNumberPrefix } });

    const roles = await seedWorkspaceRoles(workspace.id);
    const defaultDept = await seedDefaultDepartment(workspace.id);

    const membership = new memberships({
        workspaceId: workspace.id,
        userId: workspaceData.ownerId,
        roleId: roles.ownerId,
        departmentIds: [defaultDept.id],
        primaryDepartmentId: defaultDept.id,
        title: "Owner",
        status: "active",
        profile: { displayName: undefined, signature: undefined, avatar: undefined, locale: undefined },
        preferences: { notifications: { email: true, inApp: true } },
        joinedAt: new Date(),
    })

    const createdWorkspace = await workspace.save();
    const createdMembership = await membership.save();


    if (!createdWorkspace || !createdMembership) {
        throw new Error("Failed to create workspace");
    }

    return { workspaceId: createdWorkspace.id, membershipId: createdMembership.id, slug: createdWorkspace.slug };
}