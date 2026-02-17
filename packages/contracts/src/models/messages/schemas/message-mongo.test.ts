import mongoose, { type Model } from "mongoose";
import { describe, expect, it } from "vitest";
import { MessageSchemaMongo } from "./message-mongo";
import type { Message } from "./message";

const TEST_MODEL_NAME = "MessageSchemaMongoDoDTest";

function getTestModel(): Model<Message> {
    return (mongoose.models[TEST_MODEL_NAME] as Model<Message>) || mongoose.model<Message>(TEST_MODEL_NAME, MessageSchemaMongo);
}

function buildBaseMessage(overrides: Partial<Message> = {}): Partial<Message> {
    return {
        workspaceId: "ws_1",
        ticketId: "t_1",
        conversationId: "c_1",
        direction: "outbound",
        kind: "message",
        body: { text: "hello" },
        authorMembershipId: "mem_1",
        ...overrides,
    };
}

describe("MessageSchemaMongo DoD", () => {
    it("defines the required compound index", () => {
        const indexes = MessageSchemaMongo.indexes();
        const hasRequiredIndex = indexes.some(([fields]) =>
            fields.workspaceId === 1 && fields.conversationId === 1 && fields.createdAt === 1,
        );

        expect(hasRequiredIndex).toBe(true);
    });

    it("supports outbound public messages", async () => {
        const MessageModel = getTestModel();
        const doc = new MessageModel(buildBaseMessage({ direction: "outbound", kind: "message" }));

        await expect(doc.validate()).resolves.toBeUndefined();
    });

    it("supports internal notes", async () => {
        const MessageModel = getTestModel();
        const doc = new MessageModel(buildBaseMessage({ direction: "internal", kind: "note" }));

        await expect(doc.validate()).resolves.toBeUndefined();
    });

    it("requires authorMembershipId for outbound/internal", async () => {
        const MessageModel = getTestModel();

        const outboundWithoutAuthor = new MessageModel(buildBaseMessage({ direction: "outbound", authorMembershipId: undefined }));
        const internalWithoutAuthor = new MessageModel(buildBaseMessage({ direction: "internal", kind: "note", authorMembershipId: undefined }));

        await expect(outboundWithoutAuthor.validate()).rejects.toMatchObject({
            errors: { authorMembershipId: expect.anything() },
        });
        await expect(internalWithoutAuthor.validate()).rejects.toMatchObject({
            errors: { authorMembershipId: expect.anything() },
        });
    });

    it("requires customerId for inbound", async () => {
        const MessageModel = getTestModel();
        const doc = new MessageModel(
            buildBaseMessage({
                direction: "inbound",
                kind: "message",
                authorMembershipId: undefined,
                customerId: undefined,
            }),
        );

        await expect(doc.validate()).rejects.toMatchObject({
            errors: { customerId: expect.anything() },
        });
    });

    it("requires body.text or body.html", async () => {
        const MessageModel = getTestModel();
        const noBody = new MessageModel(buildBaseMessage({ body: undefined }));
        const emptyBody = new MessageModel(buildBaseMessage({ body: { text: "   ", html: "  " } }));
        const htmlOnly = new MessageModel(buildBaseMessage({ body: { html: "<p>Hi</p>" } }));

        await expect(noBody.validate()).rejects.toMatchObject({
            errors: { body: expect.anything() },
        });
        await expect(emptyBody.validate()).rejects.toMatchObject({
            errors: { body: expect.anything() },
        });
        await expect(htmlOnly.validate()).resolves.toBeUndefined();
    });
});
