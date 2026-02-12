import { Collection, getModel } from "@lytos/constant-definitions";
import { DepartmentSchemaMongo, type Department, type UpdateDepartmentDto } from "@lytos/contracts";
import { slugify } from "@lytos/tools";

export const updateDepartment = async (
    workspaceId: string,
    departmentId: string,
    dto: UpdateDepartmentDto
) => {
    const model = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const dep = await model.findOne({ _id: departmentId, workspaceId: workspaceId }).lean();
    if (!dep) throw new Error("NOT_FOUND");

    const update: Partial<Department> = {};

    if (dto.name !== undefined) update.name = dto.name.trim();
    if (dto.description !== undefined) update.description = dto.description.trim();

    if (dto.slug !== undefined) {
        const slug = slugify(dto.slug);
        const exists = await model.findOne({ workspaceId, slug, _id: { $ne: departmentId } });
        if (exists) throw new Error("SLUG_TAKEN");
        update.slug = slug;
    }

    if (dto.leadMembershipIds !== undefined) {
        update.leadMembershipIds = dto.leadMembershipIds.map((id) => id);
    }

    await model.updateOne({ _id: departmentId, workspaceId: workspaceId }, { $set: update });

    return model.findOne({ _id: departmentId, workspaceId: workspaceId });
};
