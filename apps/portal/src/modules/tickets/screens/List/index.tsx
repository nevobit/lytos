import { useMemo, useState } from "react";
import { Table, useModal, type DataTableColumn } from "@lytos/design-system";
import { useTickets } from "../../hooks/useTickets";
import type { Ticket } from "@lytos/contracts";
import styles from "./List.module.css";
import { Calendar, Filter, Info, Search, Ticket as TicketIcon, } from "lucide-react";
import { formatCLDateTime } from "@/shared/utils";
import { useCreateTicket } from "../../hooks/useCreateTicket";
import TicketFormModal from "../../components/TicketFormModal";

type Row = Partial<Ticket>;

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

const columns: DataTableColumn<Row>[] = [
    { key: "ticketNumber", header: "Ticket ID", sortable: true, render: (value) => <span className={styles.ticketId}>#{String(value ?? "—")}</span> },
    {
        key: "subject",
        header: "Asunto",
        sortable: true,
        render: (value) => <span className={styles.subject}>{String(value ?? "—")}</span>,
    },
    {
        key: "priorityId",
        header: "Prioridad",
        render: (value) => {
            const meta = priorityMeta(value);
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
        render: (value) => {
            const meta = typeMeta(value);
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
        render: (value) => {
            const name = String(value ?? (value) ?? "—");
            const avatarUrl = value as string | undefined;
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
        render: (value) => <span className={styles.date}>{formatCLDateTime((value as string))}</span>,
    },

];

export default function Tickets() {
    const { tickets } = useTickets();
    const { openModal } = useModal();
    const { isLoading, create } = useCreateTicket();

    const [query, setQuery] = useState("");
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

    const handleOpenCreate = () => {
        openModal(
            <TicketFormModal
                mode="create"
                onSubmit={create}
                isLoading={isLoading}
            />
        );
    };


    return (
        <div className={styles.page}>
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

                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenCreate} >
                        Agregar ticket
                    </button>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={14} strokeWidth='1.5px' />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
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
                    <button type="button" className={styles.filterBtn}>
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