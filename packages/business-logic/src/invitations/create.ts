import { Collection, getModel } from "@lytos/constant-definitions";
import { type Invitation, InvitationSchemaMongo } from "@lytos/contracts";

interface CreateInvitationDto {
    workspaceId: string;
    email: string;
    roleId?: string;
    departmentsIds?: string[];
    expiresAt?: Date;
    invitedByMembershipId: string;
}

export const createInvitation = async (input: CreateInvitationDto): Promise<Invitation> => {
    const model = getModel<Invitation>(Collection.INVITATIONS, InvitationSchemaMongo);


    const invitation = new model({
        workspaceId: input.workspaceId,
        email: input.email,
        roleId: input.roleId || "",
        departmentsIds: input.departmentsIds || [],
        status: "pending",
        invitedByMembershipId: input.invitedByMembershipId,
    } as Partial<Invitation>);

    const created = await invitation.save();
    if (!created) {
        throw new Error("FAILED_TO_CREATE_INVITATION");
    }

    return created;
};
