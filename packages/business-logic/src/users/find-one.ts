import { Collection, getModel } from "@lytos/constant-definitions"
import { User, UserSchemaMongo } from "@lytos/contracts";

export const findOneUser = async <K extends keyof User>(criteria: K, value: User[K]): Promise<User | null> => {
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);
    const user = await model.findOne({ [criteria]: value });
    if (!user) return null;

    return user;
}