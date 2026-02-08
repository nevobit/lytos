import { Collection, getModel } from "@lytos/constant-definitions"
import { User, UserSchemaMongo } from "@lytos/contracts";

export const findOneUser = async (criteria: keyof User, value: unknown): Promise<User> => {
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    const user = await model.findOne({ [criteria]: value });

    if (!user) throw new Error("USER_NOT_FOUND");

    return user;
}