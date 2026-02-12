import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, Membership, MembershipSchemaMongo, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";
import { issueTokens } from "./tokens";
import crypto from 'crypto';

export const switchWorkspace = async (userId: string, membershipId: string) => {
    if (!userId || !membershipId) throw new Error("BAD_REQUEST");

    const model = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);
    const workspaceModel = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);

    const membership = await model.findOne({
        userId: userId,
        lifecycleStatus: LifecycleStatus.ACTIVE,
    });

    if (!membership) throw new Error("NOT_FOUND");

    const sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;

    const { accessToken, refreshToken } = await issueTokens({
        kind: 'workspace',
        userId,
        workspaceId: membership.workspaceId,
        membershipId: membership.id,
        roleId: membership.roleId,
        sessionId: sessionId
    });

    const workspace = await workspaceModel.findById(membership.workspaceId);

    return { accessToken, refreshToken, workspace }

}