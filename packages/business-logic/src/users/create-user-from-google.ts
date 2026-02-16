import { Collection, getModel } from "@lytos/constant-definitions";
import { UserSchemaMongo, type LifecycleStatus, type User } from "@lytos/contracts";
import * as crypto from 'crypto';

type CreateUserFromGoogleInput = {
    email: string;
    name?: string | null;
    googleSub: string;
    lifecycleStatus?: LifecycleStatus;
};

export async function createUserFromGoogle(
    input: CreateUserFromGoogleInput
): Promise<User> {
    const email = input.email.trim().toLowerCase();
    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    const user = await model.create({
        email,
        name: input.name ?? null,
        lifecycleStatus: input.lifecycleStatus ?? "active",

        password: crypto.randomBytes(32).toString("hex"),

        authProviders: {
            google: {
                sub: input.googleSub,
                email,
            },
        },
    });

    return user;
}
