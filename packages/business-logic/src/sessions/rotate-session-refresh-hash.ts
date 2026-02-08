import { Collection, getModel } from "@lytos/constant-definitions";
import { SessionSchemaMongo } from "@lytos/contracts";

export async function rotateSessionRefreshHash(
    sessionDbId: string,
    newRefreshTokenHash: string
): Promise<void> {
    const model = getModel(Collection.SESSIONS, SessionSchemaMongo);

    const res = await model.updateOne(
        { _id: sessionDbId, status: "active" },
        { $set: { refreshTokenHash: newRefreshTokenHash } }
    );

    if (res.matchedCount === 0) {
        throw new Error("SESSION_NOT_FOUND_OR_REVOKED");
    }
}
