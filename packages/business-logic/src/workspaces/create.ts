import { Collection, getModel } from "@lytos/constant-definitions";
import { CreateWorkspaceDto, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";

function generateTicketPrefixFromSlug(slug: string) {
    const letters = slug.replace(/[^a-z0-9]/g, "").toUpperCase();
    return (letters.slice(0, 4) || "LYT").toUpperCase();
}

function normalizeTicketPrefix(prefix?: string) {
    if (!prefix) return null;
    const p = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!p) return null;
    if (p.length < 2 || p.length > 6) return null;
    return p;
}

export const createWorkspace = async (workspaceData: CreateWorkspaceDto): Promise<Workspace> => {
    const model = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);

    const ticketNumberPrefix =
        normalizeTicketPrefix(workspaceData?.settings?.ticketNumberPrefix) ??
        generateTicketPrefixFromSlug(workspaceData.slug);

    const workspace = new model({ ...workspaceData, settings: { ...workspaceData.settings, ticketNumberPrefix } });

    const createdWorkspace = await workspace.save();

    if (!createdWorkspace) {
        throw new Error("Failed to create workspace");
    }

    return createdWorkspace;
}