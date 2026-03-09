import { Collection, getModel } from "@lytos/constant-definitions";
import { type Invitation, InvitationSchemaMongo } from "@lytos/contracts";

export const revokeInvitation = async (invitationId: string): Promise<Invitation | null> => {
    const model = getModel<Invitation>(Collection.INVITATIONS, InvitationSchemaMongo);
    const inv = await model.findById(invitationId);
    if (!inv) return null;
    inv.status = "revoked";
    await inv.save();
    return inv;
};
