import { Collection, getModel } from "@lytos/constant-definitions";
import { DepartmentSchemaMongo, type Department } from "@lytos/contracts";

export const setDefaultDepartment = async (workspaceId: string, departmentId: string) => {
    const model = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const dep = await model.findOne({ _id: departmentId, workspaceId: workspaceId });
    if (!dep) throw new Error("NOT_FOUND");

    await model.updateMany({ workspaceId, isDefault: true }, { $set: { isDefault: false } });
    await model.updateOne({ _id: departmentId, workspaceId }, { $set: { isDefault: true } });

    return model.findOne({ _id: departmentId, workspaceId });
};
