import { Collection, getModel } from "@lytos/constant-definitions";
import { RoleSchemaMongo, type Role } from "@lytos/contracts";

export const authorizePermission = async (p: {
    workspaceId: string;
    roleId: string;
    permission: string;
}) => {
    const model = getModel<Role>(Collection.ROLES, RoleSchemaMongo);

    const role = await model.findOne({ id: p.roleId, workspaceId: p.workspaceId });
    if (!role) throw new Error("ROLE_NOT_FOUND");
    if (role.permissions.includes("*")) return;
    if (!role.permissions.includes(p.permission)) throw new Error("FORBIDDEN");
};
