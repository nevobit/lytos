import { Collection, getModel } from "@lytos/constant-definitions";
import { DepartmentSchemaMongo, type Department } from "@lytos/contracts";

export const deleteDepartment = async (workspaceId: string, departmentId: string) => {
    const model = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const dep = await model.findOne({ _id: departmentId, workspaceId });
    if (!dep) throw new Error("NOT_FOUND");
    if (dep.isDefault) throw new Error("CANNOT_DELETE_DEFAULT");

    await model.deleteOne({ _id: departmentId, workspaceId });

    return { ok: true };
};
