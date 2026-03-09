import { Collection, getModel } from "@lytos/constant-definitions";
import { type Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";

export const deleteWorkspace = async (workspaceId: string): Promise<{ ok: true }> => {
    const model = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    await model.deleteOne({ _id: workspaceId });
    return { ok: true };
};
