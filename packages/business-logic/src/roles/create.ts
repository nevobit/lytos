import { Collection, getModel } from "@lytos/constant-definitions";
import { type Role, RoleSchemaMongo, type CreateRoleDto } from "@lytos/contracts";

export const createRole = async (
    workspaceId: string,
    dto: CreateRoleDto,
): Promise<Role> => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<Role>(Collection.ROLES, RoleSchemaMongo);

    const exists = await model.findOne({ workspaceId, name: dto.name.trim() });
    if (exists) throw new Error("NAME_TAKEN");

    const role = await model.create({
        workspaceId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        permissions: dto.permissions || [],
        scopes: dto.scopes,
        isSystem: dto.isSystem ?? false,
    });

    return role.toObject();
};
