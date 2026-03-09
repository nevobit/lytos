import { Collection, getModel } from "@lytos/constant-definitions";
import { type Role, RoleSchemaMongo } from "@lytos/contracts";

export const deleteRole = async (workspaceId: string, roleId: string): Promise<{ ok: true }> => {
    const model = getModel<Role>(Collection.ROLES, RoleSchemaMongo);
    await model.deleteOne({ _id: roleId, workspaceId });
    return { ok: true };
};
