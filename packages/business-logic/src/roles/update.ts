import { Collection, getModel } from "@lytos/constant-definitions";
import { type Role, RoleSchemaMongo, type UpdateRoleDto } from "@lytos/contracts";

export const updateRole = async (
    workspaceId: string,
    roleId: string,
    dto: UpdateRoleDto,
): Promise<Role | null> => {
    if (dto.name && !dto.name.trim()) throw new Error("BAD_REQUEST");

    const model = getModel<Role>(Collection.ROLES, RoleSchemaMongo);

    if (dto.name) {
        const exists = await model.findOne({ workspaceId, name: dto.name.trim(), _id: { $ne: roleId } });
        if (exists) throw new Error("NAME_TAKEN");
    }

    const updated = await model.findByIdAndUpdate(roleId, dto, { new: true });
    return updated?.toObject() || null;
};
