import { Collection, getModel } from "@lytos/constant-definitions";
import { type User, UserSchemaMongo } from "@lytos/contracts";

export const findUserById = async (id: string): Promise<User> => {
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    const user = await model.findById(id);

    if (!user) throw new Error("User don't exists");

    return user;
}