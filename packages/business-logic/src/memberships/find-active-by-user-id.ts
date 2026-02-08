import { Collection, getModel } from "@lytos/constant-definitions"
import { Membership, MembershipSchemaMongo } from "@lytos/contracts";

export const findActiveMembershipUserByUserId = async (userId: string) => {
    const model = getModel<Membership>(Collection.MEMBERSHIPS, MembershipSchemaMongo);

    const memberships = await model.find({ userId, status: 'active' });

    return memberships;
}