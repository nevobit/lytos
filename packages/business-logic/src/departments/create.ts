import { Collection, getModel } from "@lytos/constant-definitions";
import { DepartmentSchemaMongo, type Department } from "@lytos/contracts";
import { slugify } from '@lytos/tools';

export type CreateDepartmentDto = {
    name: string;
    slug?: string;
    description?: string;
    leadMembershipIds?: string[];
    primaryLeadMembershipId: string;
};

export const createDepartment = async (workspaceId: string, dto: CreateDepartmentDto) => {
    if (!dto?.name?.trim()) throw new Error("BAD_REQUEST");

    const Departments = getModel<Department>(Collection.DEPARTMENTS, DepartmentSchemaMongo);

    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.name);

    const exists = await Departments.findOne({ workspaceId, slug });
    if (exists) throw new Error("SLUG_TAKEN");

    const created = await Departments.create({
        workspaceId: workspaceId,
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? "",
        isDefault: false,
        leadMembershipIds: (dto.leadMembershipIds ?? []).map((id) => id),
        primaryLeadMembershipId: dto.primaryLeadMembershipId
    });

    return created.toObject();
};