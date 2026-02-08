import { Collection, getModel } from "@lytos/constant-definitions";
import { SessionSchemaMongo, type Session } from "@lytos/contracts";

export async function findActiveSessionByUserIdAndHash(
    userId: string,
    refreshTokenHash: string
): Promise<Session | null> {
    const model = getModel<Session>(Collection.SESSIONS, SessionSchemaMongo)

    const session = await model.findOne({
        userId,
        refreshTokenHash,
        status: "active",
    }).lean();

    if (!session) return null;

    return session;
}
