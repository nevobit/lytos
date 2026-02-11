import { Collection, getModel } from "@lytos/constant-definitions";
import { RoleSchemaMongo } from "@lytos/contracts";

export type RoleKey = "owner" | "admin" | "lead" | "agent" | "viewer";

export type Role = {
    id: string;
    key: RoleKey;
    name: string;
    description?: string;
};

export async function findRoleByKeyOrName(keyOrName: string): Promise<Role | null> {
    const raw = keyOrName.trim();
    const normalized = raw.toLowerCase();

    const model = getModel(Collection.ROLES, RoleSchemaMongo);

    const doc: Role | null = await model.findOne({
        $or: [
            { key: normalized },
            { name: { $regex: new RegExp(`^${escapeRegExp(raw)}$`, "i") } },
        ],
    });

    if (!doc) return null;

    return {
        id: doc.id,
        key: doc.key,
        name: doc.name,
        description: doc.description ?? "",
    };
}

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
