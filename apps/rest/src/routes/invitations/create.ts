import { makeFastifyRoute, RouteMethod } from "@lytos/constant-definitions";
import { verifyJwt } from "@lytos/security";
import { authorizePermission } from "@lytos/business-logic";
import { createInvitation } from "@lytos/business-logic";

export const createInvitationRoute = makeFastifyRoute(
    RouteMethod.POST,
    "/",
    verifyJwt,
    { tenant: "required", auth: "required" },
    async (req, reply) => {
        const workspaceId = req.auth?.workspaceId;
        const roleId = req.auth?.roleId;
        const membershipId = req.auth?.membershipId as string | undefined;

        if (!workspaceId || !roleId || !membershipId) {
            return reply.code(409).send({ message: "Workspace context required" });
        }

        await authorizePermission({
            workspaceId,
            roleId,
            permission: "invitations.manage",
        });

        try {
            const dto = req.body as {
                email: string;
                roleId?: string;
                departmentsIds?: string[];
            };
            if (!dto.email || typeof dto.email !== "string") {
                return reply.code(400).send({ message: "Invalid email" });
            }

            const created = await createInvitation({
                workspaceId,
                email: dto.email.trim(),
                roleId: dto.roleId,
                departmentsIds: dto.departmentsIds,
                invitedByMembershipId: membershipId,
            });

            return reply.code(201).send(created);
        } catch (e) {
            const msg = (e as { message?: string })?.message;
            if (msg === "FAILED_TO_CREATE_INVITATION") {
                return reply.code(500).send({ message: "Could not create invitation" });
            }
            return reply.code(500).send({ message: "Server error" });
        }
    }
);
