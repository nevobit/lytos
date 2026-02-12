import { Collection, getModel } from "@lytos/constant-definitions"
import { CreateRoleDto, RoleSchemaMongo } from "@lytos/contracts"
import { Role } from "@lytos/security";

export const seedWorkspaceRoles = async (workspaceId: string) => {
    const model = getModel<Role
    >(Collection.ROLES, RoleSchemaMongo);

    const roles: CreateRoleDto[] = [
        {
            workspaceId,
            name: "Owner",
            description: "Full access",
            permissions: ["*"],
            scopes: {
                ticketsRead: "all",
                ticketsWrite: "all",
                ticketsAssign: 'all',
                customersRead: 'all',
                ticketsStatus: "all",
                ticketsMerge: "all",
                messagesRead: "all",
                messagesSend: "all",
                notesWrite: "all",
                attachmentsRead: "all",
                attachmentsWrite: "all"
            },
            isSystem: true,
        },
        {
            workspaceId,
            name: "Admin",
            description: "Manage workspace and operations",
            permissions: [
                "workspace.manage",
                "roles.manage",
                "departments.manage",
                "members.manage",
                "invitations.manage",
                "audit.read",
            ],
            scopes: {
                ticketsRead: "all",
                ticketsWrite: "all",
                ticketsAssign: "all",
                customersRead: "all",
                ticketsStatus: 'all',
                ticketsMerge: "all"
            },
            isSystem: true,
        },
        {
            workspaceId,
            name: "Agent",
            description: "Support agent",
            permissions: [
                "tickets.read",
                "tickets.reply",
                "tickets.update",
            ],
            scopes: {
                ticketsRead: "department",
                ticketsWrite: "assigned",
                ticketsAssign: "department",
                customersRead: "assigned",
                ticketsStatus: 'department',
                ticketsMerge: 'department'
            },
            isSystem: true,
        },
        {
            workspaceId,
            name: "Viewer",
            description: "Read-only access",
            permissions: [
                "tickets.read",
            ],
            scopes: {
                ticketsRead: "assigned",
                ticketsWrite: "assigned",
                ticketsAssign: "department",
                customersRead: "assigned",
            },
            isSystem: true,
        }
    ]

    const createdRoles = await model.insertMany(roles);

    return {
        ownerId: createdRoles[0]?.id,
        adminId: createdRoles[1]?.id,
        agentId: createdRoles[2]?.id,
        viewerId: createdRoles[3]?.id
    };
}