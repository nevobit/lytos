import type { FastifyRequest } from "fastify";
import { extractTenantSlugFromHost } from "@lytos/core-modules";
import { slugify } from "@lytos/tools";
import { findWorkspaceBySlug } from "@lytos/business-logic";

export type TenancyConfig = {
    baseDomain: string;
    pathPrefix: string;
    apiPrefix: string;
    allowPathMode: boolean;
    allowHeaderMode: boolean;
    allowHostMode: boolean;

    tenantHeaderName: string;
    reservedSubdomains: string[];
};


export async function registerTenancy(req: FastifyRequest, cfg: TenancyConfig) {
    const isApiCall =
        req.url.startsWith(cfg.apiPrefix) ||
        (cfg.allowPathMode && req.url.startsWith(cfg.pathPrefix + "/"));

    if (!isApiCall) return;

    // 1) PATH MODE API: /w/:slug/api/v1/...
    // if (cfg.allowPathMode && req.url.startsWith(cfg.pathPrefix + "/")) {
    //     const rest = req.url.slice(cfg.pathPrefix.length + 1); // quita "/w/"
    //     const firstSlash = rest.indexOf("/");
    //     if (firstSlash > 0) {
    //         const slug = normalizeSlug(rest.slice(0, firstSlash));
    //         const tail = rest.slice(firstSlash); // "/api/v1/..." o "/tickets" (frontend)

    //         if (tail.startsWith(cfg.apiPrefix)) {
    //             if (!isValidSlug(slug)) throw app.httpErrors.badRequest("Invalid workspace slug");

    //             // Normalizamos a /api/v1/...
    //             req.url = tail;

    //             const ws = await app.workspacesRepo.findBySlug(slug);
    //             if (!ws) throw app.httpErrors.notFound("Workspace not found");

    //             req.tenant = { workspaceId: String(ws._id), slug, mode: "path" };
    //             return;
    //         }
    //     }
    //     // Si era /w/... pero no era API, no hacemos nada (frontend path)
    //     return;
    // }

    if (cfg.allowHeaderMode) {
        const headerValue = req.headers[cfg.tenantHeaderName] as string | undefined;
        if (headerValue) {
            const slug = slugify(headerValue);

            const ws = await findWorkspaceBySlug(slug);
            if (!ws) throw new Error("Workspace not found");

            req.tenant = { workspaceId: ws.id, slug, mode: "header" };
            return;
        }
    }


    if (cfg.allowHostMode) {
        const host = req.headers.host ?? "";
        const slug = extractTenantSlugFromHost({
            hostHeader: host,
            baseDomain: cfg.baseDomain,
            reservedSubdomains: cfg.reservedSubdomains,
        });

        if (slug) {
            const ws = await findWorkspaceBySlug(slug);
            if (!ws) throw new Error("Workspace not found");

            req.tenant = { workspaceId: ws.id, slug, mode: "host" };
            return;
        }
    }

}