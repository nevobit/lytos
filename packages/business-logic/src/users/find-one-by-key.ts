import { Collection, getModel } from "@lytos/constant-definitions";
import { UpdateUserDto, UserSchemaMongo, type User } from "@lytos/contracts";

export type FindUserKey = "email" | "id" | "googleSub";

export async function findOneUserByKey(key: FindUserKey, value: string): Promise<UpdateUserDto | null> {
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    let user: User | null = null;
    if (key === "email") {
        user = await model.findOne({ email: value.trim().toLowerCase() });
    } else if (key === "id") {
        user = await model.findById(value);
    } else if (key === "googleSub") {
        user = await model.findOne({ "authProviders.google.sub": value });
    }

    if (!user) return null;

    return user;
}
