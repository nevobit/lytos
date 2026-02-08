import bcrypt from "bcrypt";

export async function hashPassword(raw: string) {
    return bcrypt.hash(raw, 12);
}

export async function verifyPassword(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
}