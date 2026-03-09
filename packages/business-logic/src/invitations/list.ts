import { Collection, getModel } from "@lytos/constant-definitions";
import { type Invitation, InvitationSchemaMongo } from "@lytos/contracts";

export const getWorkspaceInvitations = async (workspaceId: string): Promise<Invitation[]> => {
    const model = getModel<Invitation>(Collection.INVITATIONS, InvitationSchemaMongo);
    return await model.find({ workspaceId, status: "pending" });
};
