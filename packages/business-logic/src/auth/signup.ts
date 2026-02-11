import { CreateUserDto, LifecycleStatus, UpdateUserDto } from "@lytos/contracts";
import { findOneUser, createUser } from "../users";

export const signup = async (input: CreateUserDto): Promise<UpdateUserDto> => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) throw new Error("INVALID_INPUT");

    const existing = await findOneUser("email", email);
    if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

    const user = await createUser({
        ...input,
        email,
        name: input.name ?? null,
        lifecycleStatus: LifecycleStatus.ACTIVE,
        userAgent: input.userAgent
    });

    return user;
}
