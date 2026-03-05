import { useMemo, useState } from "react";
import { Table, type DataTableColumn } from "@lytos/design-system";
import styles from "./List.module.css";
import { ChevronDown, Filter, Search, Calendar, Columns3, Building2, Users } from "lucide-react";

export type CustomerRow = {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    dateCreated?: string | Date | null;
    organizationName?: string;
    organizationIcon?: "meta" | "microsoft" | "apple" | "slack" | "youtube" | "google" | "generic";
    tags?: Array<"fast" | "slow" | "none">;
    latestUpdateDaysAgo?: number; // placeholder
};

function formatCLDate(input?: string | Date | null): string {
    if (!input) return "—";
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name?: string): string {
    if (!name) return "—";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "—";
}

function formatDaysAgo(n?: number): string {
    const v = typeof n === "number" ? n : 0;
    if (v <= 0) return "hoy";
    if (v === 1) return "hace 1 día";
    return `hace ${v} días`;
}

function tagMeta(tag: "fast" | "slow" | "none") {
    if (tag === "fast") return { label: "Respuesta rápida", tone: "tagFast" as const };
    if (tag === "slow") return { label: "Respuesta lenta", tone: "tagSlow" as const };
    return { label: "Sin respuesta", tone: "tagNone" as const };
}

// function OrgIcon({ kind }: { kind?: CustomerRow["organizationIcon"] }) {
//     // sin imágenes: usamos mini “logo” por CSS (circulitos + letra)
//     const k = kind ?? "generic";
//     return <span className={`${styles.orgIcon} ${styles[`org_${k}`]}`} aria-hidden />;
// }

export default function Customers() {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState<"lista" | "organizaciones">("lista");

    // ✅ Placeholder: valores en 0 / vacío (como pediste). Después lo conectas a tu hook real.
    const rows: CustomerRow[] = useMemo(() => [], []);

    const filteredRows = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const name = String(r.name ?? "").toLowerCase();
            const email = String(r.email ?? "").toLowerCase();
            const phone = String(r.phone ?? "").toLowerCase();
            const org = String(r.organizationName ?? "").toLowerCase();
            return name.includes(q) || email.includes(q) || phone.includes(q) || org.includes(q);
        });
    }, [rows, query]);

    const columns: DataTableColumn<CustomerRow>[] =
        [
            {
                key: "name",
                header: "Nombre",
                sortable: true,
                render: (value) => {
                    const name = value ?? "—";
                    return (
                        <span className={styles.clientCell}>
                            <span className={styles.avatar}>
                                <span className={styles.avatarFallback}>{getInitials(name as string)}</span>
                            </span>
                            <span className={styles.clientName}>{name as string}</span>
                        </span>
                    );
                },
            },
            {
                key: "email",
                header: "Email",
                sortable: true,
                render: (value) =>
                    value ? (
                        <a className={styles.linkCell} href={`mailto:${value}`}>
                            {(value as string)}
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                key: "phone",
                header: "Teléfono",
                sortable: true,
                render: (value) =>
                    value ? (
                        <a className={styles.linkCell} href={`tel:${(value as string).replace(/\s+/g, "")}`}>
                            {(value as string)}
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                key: "dateCreated",
                header: "Fecha de creación",
                sortable: true,
                render: (value) => <span className={styles.date}>{formatCLDate(value as string)}</span>,
            },
            {
                key: "organizationName",
                header: "Organización",
                sortable: true,
                render: (value) => {
                    const org = value ?? "—";
                    return (
                        <span className={styles.orgCell}>
                            {/* <OrgIcon kind={(value as string)} /> */}
                            <span className={styles.orgName}>{(org as string)}</span>
                        </span>
                    );
                },
            },
            {
                key: "tags",
                header: "Etiquetas",
                render: (value) => {
                    const tags = (value as string[]) ?? [];
                    if (!tags.length) return "—";
                    return (
                        <span className={styles.tagsWrap}>
                            {tags.slice(0, 2).map((t) => {
                                const m = tagMeta(t as 'fast' | 'slow');
                                return (
                                    <span key={t} className={`${styles.tagBadge} ${styles[m.tone]}`}>
                                        {m.label}
                                    </span>
                                );
                            })}
                        </span>
                    );
                },
            },
            {
                key: "latestUpdateDaysAgo",
                header: "Última actualización",
                sortable: true,
                render: (value) => <span className={styles.mutedCell}>{formatDaysAgo(value as number)}</span>,
            }
        ];

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>Clientes</div>
                    <div className={styles.subtitle}>0 clientes</div>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.splitBtn}>
                        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Agregar cliente
                        </button>
                        <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.splitBtnRight}`} aria-label="Abrir menú">
                            <ChevronDown size={16} strokeWidth="1.5px" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={14} strokeWidth="1.5px" />
                    <input className={styles.searchInput} placeholder="Buscar" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <span className={styles.kbdHint} aria-hidden>
                        ⌘ K
                    </span>
                </div>

                <div className={styles.filters}>
                    <button type="button" className={styles.filterBtn}>
                        <Calendar strokeWidth="1.5px" size={16} />
                        Fecha de creación
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <Building2 strokeWidth="1.5px" size={16} />
                        Organización
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <Filter strokeWidth="1.5px" size={16} />
                        Origen
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <Columns3 strokeWidth="1.5px" size={16} />
                        Gestionar columnas
                    </button>

                    <div className={styles.segTabs}>
                        <button
                            type="button"
                            className={`${styles.segTab} ${tab === "lista" ? styles.segTabActive : ""}`}
                            onClick={() => setTab("lista")}
                        >
                            <Users size={16} strokeWidth="1.5px" />
                            Lista de clientes
                        </button>
                        <button
                            type="button"
                            className={`${styles.segTab} ${tab === "organizaciones" ? styles.segTabActive : ""}`}
                            onClick={() => setTab("organizaciones")}
                        >
                            <Building2 size={16} strokeWidth="1.5px" />
                            Organizaciones
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <Table columns={columns} rows={filteredRows} />
            </div>
        </div>
    );
}