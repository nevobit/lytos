import { Collection, getModel } from "@lytos/constant-definitions";
import { CreateMembershipDto, Membership, MembershipSchemaMongo } from "@lytos/contracts";

export const createMembership = async (membershipData: CreateMembershipDto): Promise<Membership> => {
    const model = getModel<Membership>(Collection.WORKSPACES, MembershipSchemaMongo);

    const membership = new model(membershipData);

    const createdMembership = await membership.save();

    if (!createdMembership) {
        throw new Error("Failed to create membership");
    }

    return createdMembership;
}