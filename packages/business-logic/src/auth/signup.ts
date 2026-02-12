import { CreateUserDto, LifecycleStatus, UpdateUserDto } from "@lytos/contracts";
import { findOneUser, createUser } from "../users";

export const signup = async (input: CreateUserDto): Promise<UpdateUserDto> => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) throw new Error("INVALID_INPUT");

    const exists = await findOneUser("email", email);
    if (exists) throw new Error("EMAIL_TAKEN");

    const user = await createUser({
        ...input,
        email,
        name: input.name ?? null,
        lifecycleStatus: LifecycleStatus.ACTIVE,
        userAgent: input.userAgent
    });

    return user;
}
