export type Role = "owner" | "admin" | "lead" | "agent" | "viewer";

const ROLE_SCOPES: Record<Role, string[]> = {
    owner: [
        "workspace.manage",
        "members.invite",
        "members.update",
        "tickets.read",
        "tickets.create",
        "tickets.reply",
        "tickets.update",
        "tickets.assign",
        "contacts.read",
        "contacts.create",
    ],
    admin: [
        "workspace.manage",
        "members.invite",
        "members.update",
        "tickets.read",
        "tickets.create",
        "tickets.reply",
        "tickets.update",
        "tickets.assign",
        "contacts.read",
        "contacts.create",
    ],
    lead: [
        "tickets.read",
        "tickets.create",
        "tickets.reply",
        "tickets.update",
        "tickets.assign",
        "contacts.read",
        "contacts.create",
    ],
    agent: [
        "tickets.read",
        "tickets.create",
        "tickets.reply",
        "tickets.update",
        "contacts.read",
        "contacts.create",
    ],
    viewer: ["tickets.read", "contacts.read"],
};

export function scopesForRole(role: Role): string[] {
    return ROLE_SCOPES[role] ?? ROLE_SCOPES.viewer;
}
