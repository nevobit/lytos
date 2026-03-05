import { useMemo, useState } from "react";
import { Table, type DataTableColumn } from "@lytos/design-system";
import { useTickets } from "../../hooks/useTickets";
import type { Ticket } from "@lytos/contracts";
import styles from "./List.module.css";
import { Calendar, Filter, Info, Search, Ticket as TicketIcon, } from "lucide-react";

type Row = Partial<Ticket>;

function formatCLDateTime(input?: string | Date | null): string {
    if (!input) return "—";
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";

    const date = d.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const time = d.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `${date}, ${time}`;
}

function getInitials(name?: string): string {
    if (!name) return "—";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
    return initials || "—";
}

function priorityMeta(priorityId?: unknown): { label: string; tone: "low" | "medium" | "high" } {
    const v = String(priorityId ?? "").toLowerCase();
    if (v.includes("high") || v.includes("alta") || v === "3") return { label: "Alta", tone: "high" };
    if (v.includes("med") || v.includes("media") || v === "2") return { label: "Media", tone: "medium" };
    if (v.includes("low") || v.includes("baja") || v === "1") return { label: "Baja", tone: "low" };
    return { label: "—", tone: "low" };
}

function typeMeta(categoryId?: unknown): { label: string; icon: string } {
    const v = String(categoryId ?? "").toLowerCase();
    if (v.includes("incident") || v.includes("incidente")) return { label: "Incidente", icon: "⚠️" };
    if (v.includes("suggest") || v.includes("suger")) return { label: "Sugerencia", icon: "💡" };
    if (v.includes("question") || v.includes("preg")) return { label: "Pregunta", icon: "❓" };
    if (v.includes("problem") || v.includes("proble")) return { label: "Problema", icon: "🧩" };
    return { label: "—", icon: "•" };
}

export default function Tickets() {
    const { tickets } = useTickets();

    // UI state (por ahora solo visual)
    const [query, setQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
    const [focusMode, setFocusMode] = useState(false);

    const rows: Row[] = tickets?.items ?? [];

    const filteredRows = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const ticket = String((r)?.ticketNumber ?? "").toLowerCase();
            const subject = String((r)?.subject ?? "").toLowerCase();
            const customer = String((r)?.customerId ?? (r)?.customerId ?? "").toLowerCase();
            return ticket.includes(q) || subject.includes(q) || customer.includes(q);
        });
    }, [rows, query]);

    const columns: DataTableColumn<Row>[] = useMemo(
        () => [
            { key: "ticketNumber", header: "Ticket ID", sortable: true, render: (row: Row) => <span className={styles.ticketId}>#{String((row)?.ticketNumber ?? "—")}</span> },
            {
                key: "subject",
                header: "Asunto",
                sortable: true,
                render: (row: Row) => <span className={styles.subject}>{String((row)?.subject ?? "—")}</span>,
            },
            {
                key: "priorityId",
                header: "Prioridad",
                render: (row: Row) => {
                    const meta = priorityMeta((row)?.priorityId);
                    return (
                        <span className={`${styles.badge} ${styles[`badge_${meta.tone}`]}`}>
                            <span className={styles.badgeDot} />
                            {meta.label}
                        </span>
                    );
                },
            },
            {
                key: "categoryId",
                header: "Tipo",
                render: (row: Row) => {
                    const meta = typeMeta((row)?.categoryId);
                    return (
                        <span className={styles.typePill}>
                            <span className={styles.typeIcon} aria-hidden>
                                {meta.icon}
                            </span>
                            {meta.label}
                        </span>
                    );
                },
            },
            {
                key: "customerId",
                header: "Cliente",
                render: (row: Row) => {
                    const name = String((row)?.customerId ?? (row)?.customerId ?? "—");
                    const avatarUrl = (row)?.customerId as string | undefined;
                    return (
                        <span className={styles.clientCell}>
                            <span className={styles.avatar}>
                                {avatarUrl ? <img className={styles.avatarImg} src={avatarUrl} alt="" /> : <span className={styles.avatarFallback}>{getInitials(name)}</span>}
                            </span>
                            <span className={styles.clientName}>{name}</span>
                        </span>
                    );
                },
            },
            {
                key: "createdAt",
                header: "Fecha de solicitud",
                sortable: true,
                render: (row: Row) => <span className={styles.date}>{formatCLDateTime((row)?.createdAt)}</span>,
            },
            {
                key: "__actions",
                header: "",
                sortable: false,
                render: () => (
                    <button className={styles.kebab} type="button" aria-label="Más acciones">
                        …
                    </button>
                ),
                width: 44,
            },
        ],
        [selectedIds]
    );

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <div className={styles.title}>Tickets</div>
                    <div className={styles.copy}><strong>{tickets?.items?.length}</strong> tickets</div>

                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnGhost} ${focusMode ? styles.btnGhostActive : ""}`}
                        onClick={() => setFocusMode((v) => !v)}
                    >
                        Modo enfoque
                    </button>

                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Agregar ticket
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={14} strokeWidth='1.5px' />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {/* <span className={styles.kbdHint} aria-hidden>
                        ⌘ K
                    </span> */}
                </div>

                <div className={styles.filters}>
                    <button type="button" className={styles.filterBtn}>
                        <TicketIcon strokeWidth="1.5px" size={16} />
                        Tipo
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <span className={styles.filterIcon} aria-hidden>
                            ⤓
                        </span>
                        Origen
                    </button>
                    <button type="button" onClick={() => setSelectedIds} className={styles.filterBtn}>
                        <Info strokeWidth="1.5px" size={16} />
                        Prioridad
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <Calendar strokeWidth="1.5px" size={16} />
                        Fecha de ingreso
                    </button>
                    <button type="button" className={styles.filterBtn}>
                        <Filter strokeWidth="1.5px" size={16} />
                        Filtros
                    </button>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <Table

                    columns={columns}
                    rows={filteredRows}
                />
            </div>
        </div>
    );
}