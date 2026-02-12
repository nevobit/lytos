import { Collection, getModel } from "@lytos/constant-definitions";
import { Department, DepartmentSchemaMongo } from "@lytos/contracts";

export const seedDefaultDepartment = async (workspaceId: string) => {
    const model = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const department = new model({
        workspaceId,
        name: 'General',
        slug: 'general',
        description: 'Default department',
        isDefault: true,
        leadMembershipIds: [],
    });

    const createdDepartment = await department.save();

    return createdDepartment;
}