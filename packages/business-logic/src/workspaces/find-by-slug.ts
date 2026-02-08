import { LifecycleStatus, Workspace, WorkspaceSchemaMongo } from "@lytos/contracts";
import { Collection, getModel, getRedisReadClient, getRedisWriteClient } from "@lytos/constant-definitions";

export const findWorkspaceBySlug = async (slug: string): Promise<Workspace | null> => {
    const key = `ws:slug:${slug}`;

    const gcache = getRedisReadClient();
    const res = await gcache.hget("api-cache", key);

    if (res) {
        return (JSON.parse(res)) as Workspace;
    }


    const model = getModel<Workspace>(Collection.WORKSPACES, WorkspaceSchemaMongo);
    const workspace = await model.findOne({ slug, lifecycleStatus: LifecycleStatus.ACTIVE }).lean();
    if (!workspace) return null;

    const scache = getRedisWriteClient();

    await scache.hset("api-cache", key, JSON.stringify(workspace), "EX", 60);
    return workspace;
}