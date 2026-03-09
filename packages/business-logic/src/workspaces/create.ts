import { Collection, getModel } from "@lytos/constant-definitions";
import { type Membership, MembershipSchemaMongo, type Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";
import { seedWorkspaceRoles } from "../roles";
import { seedDefaultDepartment } from "../departments";

export function generateTicketPrefixFromSlug(slug: string) {
    const letters = slug.replace(/[^a-z0-9]/gi, "").toUpperCase();
    return (letters.slice(0, 4) || "LYT").toUpperCase();
}

export function normalizeTicketPrefix(prefix?: string) {
    if (!prefix) return null;

    const normalized = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!normalized) return null;
    if (normalized.length < 2 || normalized.length > 6) return null;

    return normalized;
}

async function prefixExists(prefix: string) {
    const workspaces = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);

    const existing = await workspaces.exists({
        "settings.ticketNumberPrefix": prefix,
    });

    return Boolean(existing);
}

export async function ensureUniqueTicketPrefix(basePrefix: string) {
    const normalizedBase = normalizeTicketPrefix(basePrefix) ?? "LYT";

    if (!(await prefixExists(normalizedBase))) {
        return normalizedBase;
    }

    for (let i = 1; i <= 9999; i++) {
        const suffix = String(i);
        const trimmedBase = normalizedBase.slice(0, 6 - suffix.length);
        const candidate = `${trimmedBase}${suffix}`;

        if (!(await prefixExists(candidate))) {
            return candidate;
        }
    }

    throw new Error("FAILED_TO_GENERATE_UNIQUE_TICKET_PREFIX");
}

export const createWorkspace = async (workspaceData: Partial<Workspace>) => {
    const workspaces = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    const memberships = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);

    const baseTicketPrefix =
        normalizeTicketPrefix(workspaceData?.settings?.ticketNumberPrefix) ??
        generateTicketPrefixFromSlug(workspaceData.slug || "");

    const ticketNumberPrefix = await ensureUniqueTicketPrefix(baseTicketPrefix);

    const workspace = new workspaces({
        ...workspaceData,
        settings: {
            ...workspaceData.settings,
            ticketNumberPrefix,
        },
    });

    const createdWorkspace = await workspace.save();

    if (!createdWorkspace) {
        throw new Error("Failed to create workspace");
    }

    const roles = await seedWorkspaceRoles(createdWorkspace.id);
    const defaultDept = await seedDefaultDepartment(createdWorkspace.id);

    const membership = new memberships({
        workspaceId: createdWorkspace.id,
        userId: workspaceData.ownerId,
        roleId: roles.ownerId,
        departmentIds: [defaultDept.id],
        primaryDepartmentId: defaultDept.id,
        title: "Owner",
        status: "active",
        profile: {
            displayName: undefined,
            signature: undefined,
            avatar: undefined,
            locale: undefined,
        },
        preferences: {
            notifications: {
                email: true,
                inApp: true,
            },
        },
        joinedAt: new Date(),
    });

    const createdMembership = await membership.save();

    if (!createdMembership) {
        throw new Error("Failed to create workspace membership");
    }

    return {
        workspaceId: createdWorkspace.id,
        membershipId: createdMembership.id,
        slug: createdWorkspace.slug,
    };
};