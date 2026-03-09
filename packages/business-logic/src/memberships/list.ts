import { Collection, getModel } from "@lytos/constant-definitions";
import { Membership, MembershipSchemaMongo, UserSchemaMongo, type Params, type User } from "@lytos/contracts";

type MembershipDto = Membership & { userId: User }
export const getAllMembershipUsers = async ({ workspaceId }: Params): Promise<Partial<User[]> | null> => {
    const modelMembership = getModel<MembershipDto>(Collection.MEMBERSHIPS, MembershipSchemaMongo);
    getModel<User>(Collection.USERS, UserSchemaMongo);

    const memberships = await modelMembership.find({
        workspaceId,
        status: 'active'
    }).populate({
        path: "userId",
        select: "id name",
    });

    const users = memberships
        .map((membership: MembershipDto) => {
            const user = membership.userId as { id: string; name: string } | null;
            if (!user) return null;

            return {
                id: String(user.id),
                name: user.name,
            };
        })
        .filter(Boolean) as User[];

    console.log(users)
    return users || [];
}