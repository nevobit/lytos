import { Collection, getModel } from "@lytos/constant-definitions";
import { CreateSessionDto, Session, SessionSchemaMongo } from "@lytos/contracts";

export const createSession = async (sessionData: CreateSessionDto): Promise<Session> => {
    const model = getModel<Session>(Collection.WORKSPACES, SessionSchemaMongo);

    const session = new model(sessionData);

    const createdSession = await session.save();

    if (!createdSession) {
        throw new Error("Failed to create session");
    }

    return createdSession;
}