export function extractTenantSlugFromHost(params: {
    hostHeader: string;
    baseDomain: string;
    reservedSubdomains: string[];
}) {
    const raw = (params.hostHeader || "").split(":")[0]?.toLowerCase();
    if (!raw) return null;

    if (!raw.endsWith(params.baseDomain)) return null;

    const left = raw.slice(0, raw.length - params.baseDomain.length);
    const slug = left.replace(/\.$/, "");

    if (!slug) return null;

    if (params.reservedSubdomains.includes(slug)) return null;

    if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) return null;

    return slug;
}
