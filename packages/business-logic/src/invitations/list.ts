import { Collection, getModel } from "@lytos/constant-definitions";
import { type Invitation, InvitationSchemaMongo, User, UserSchemaMongo, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";

export const getWorkspaceInvitations = async (userId: string): Promise<Invitation[]> => {
    const model = getModel<Invitation>(Collection.INVITATIONS, InvitationSchemaMongo);
    const modelUsers = getModel<User>(Collection.USERS, UserSchemaMongo);
    getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);

    const user = await modelUsers.findById(userId)

    const invitations = await model.find({ email: user?.email, status: "pending" }).populate("workspaceId");
    return invitations;
};
