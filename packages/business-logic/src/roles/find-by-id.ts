import { Collection, getModel } from "@lytos/constant-definitions";
import { type Role, RoleSchemaMongo } from "@lytos/contracts";

export const findRoleById = async (id: string): Promise<Role> => {
    const model = getModel<Role>(Collection.ROLES, RoleSchemaMongo);

    const role = await model.findById({ id, status: 'active' });

    if (!role) throw new Error("ROLE NOT EXISTS");

    return role;
}