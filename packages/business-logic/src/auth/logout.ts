import { Collection, getModel } from "@lytos/constant-definitions";
import { LifecycleStatus, type Session, SessionSchemaMongo } from "@lytos/contracts";

type LogoutInput = {
    userId: string;
    sessionId: string;
    all?: boolean;
};

export const logout = async (input: LogoutInput) => {
    if (!input.userId || !input.sessionId) throw new Error("BAD_REQUEST");

    const model = getModel<Session>(Collection.SESSIONS, SessionSchemaMongo);

    const now = new Date()
    if (input.all) {
        const res = await model.updateMany(
            { userId: input.userId, lifecicleStatus: LifecycleStatus.ACTIVE },
            { $set: { status: "revoked", revokedAt: now, revokeReason: "logout_all" } }
        );
        return { ok: true, revokedCount: res.modifiedCount ?? 0 };
    }


    const res = await model.updateOne(
        { _id: input.sessionId, userId: input.userId, lifecycleStatus: LifecycleStatus.ACTIVE },
        { $set: { status: "revoked", revokedAt: now, revokeReason: "logout" } }
    );

    return { ok: true, revoked: (res.modifiedCount) > 0 };
};
