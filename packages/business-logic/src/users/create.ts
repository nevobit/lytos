import { Collection, getModel } from "@lytos/constant-definitions";
import { UserSchemaMongo, type CreateUserDto, type User } from "@lytos/contracts";
import { hashPassword } from "@lytos/security";

export async function createUser(input: CreateUserDto): Promise<User> {
    const email = input.email.trim().toLowerCase();

    const model = getModel<User>(Collection.USERS, UserSchemaMongo);

    const passwordHash = await hashPassword(input?.password || '');

    const doc = new model({
        ...input,
        name: input.name.trim(),
        email,
        password: passwordHash,
        security: { twoFactorEnabled: false },
        isEmailVerified: false,
        locked: false,
        loginAttempts: 0,
        lastLogin: new Date()
    });

    const createdUser = await doc.save();

    return createdUser;
}
