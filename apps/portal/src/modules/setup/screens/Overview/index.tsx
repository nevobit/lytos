import { Button } from "@lytos/design-system";
import {
    Building2,
    CheckCircle2,
    CircleAlert,
    CreditCard,
    FolderKanban,
    LifeBuoy,
    Plus,
    ShieldCheck,
    Ticket,
    Users,
    Zap,
} from "lucide-react";
import styles from "./Overview.module.css";
import { useSession } from "@/shared";
import { useDepartments } from "@/modules/departments/hooks/useDepartments";
import { useTickets } from "@/modules/tickets/hooks/useTickets";
import { useScalationRules } from "@/modules/scalation-rules/hooks/useScalationRules";
import { useUsers } from "@/modules/auth/hooks";
import { useCustomers } from "@/modules/customers/hooks/useCustomers";

type OverviewStat = {
    label: string;
    value: string;
    hint?: string;
    tone?: "neutral" | "success" | "warning";
};

type ChecklistItem = {
    id: string;
    label: string;
    done: boolean;
};

type ActivityItem = {
    id: string;
    title: string;
    description: string;
    time: string;
};

type QuickAction = {
    id: string;
    label: string;
    variant?: "primary" | "secondary";
    onClick?: () => void;
};

type OverviewProps = {
    workspaceName?: string;
    workspaceSlug?: string;
    planName?: string;
    activeAgents?: number;
    monthlyTickets?: number;
    slaHealth?: number;
    departmentsCount?: number;
    escalationRulesCount?: number;
    connectedChannelsCount?: number;
    checklist?: ChecklistItem[];
    recentActivity?: ActivityItem[];
    quickActions?: QuickAction[];
};

const defaultChecklist: ChecklistItem[] = [
    { id: "1", label: "Crear departamentos", done: true },
    { id: "2", label: "Configurar prioridades", done: true },
    { id: "3", label: "Crear reglas de escalamiento", done: false },
    { id: "4", label: "Agregar agentes", done: true },
    { id: "5", label: "Conectar canal de atención", done: false },
];

const defaultRecentActivity: ActivityItem[] = [
    {
        id: "1",
        title: "Se actualizó la configuración del workspace",
        description: "Cambios recientes en preferencias generales y prioridades.",
        time: "Hace 2 horas",
    },
    {
        id: "2",
        title: "Nuevo agente agregado",
        description: "Se incorporó un nuevo usuario al equipo de soporte.",
        time: "Hoy",
    },
    {
        id: "3",
        title: "Última factura emitida",
        description: "La factura del ciclo actual ya se encuentra disponible.",
        time: "01 Mar 2026",
    },
];

const defaultQuickActions: QuickAction[] = [
    { id: "1", label: "Agregar agente", variant: "primary" },
    { id: "2", label: "Crear departamento", variant: "secondary" },
    { id: "3", label: "Crear regla", variant: "secondary" },
    { id: "4", label: "Ver facturación", variant: "secondary" },
];

const formatNumber = (value: number) => new Intl.NumberFormat("es-CO").format(value);

const getSlaTone = (slaHealth: number): "neutral" | "success" | "warning" => {
    if (slaHealth >= 95) return "success";
    if (slaHealth >= 85) return "neutral";
    return "warning";
};

const Overview = ({
    planName = "Growth",
    slaHealth = 96,
    connectedChannelsCount = 1,
    checklist = defaultChecklist,
    recentActivity = defaultRecentActivity,
    quickActions = defaultQuickActions,
}: OverviewProps) => {
    const { workspace } = useSession();
    const { departments } = useDepartments();
    const { tickets } = useTickets();
    const { scalationRules } = useScalationRules();

    const { users } = useUsers();
    const { customers } = useCustomers();

    const actives = users?.length + customers?.items.length;

    const stats: OverviewStat[] = [
        {
            label: "Plan actual",
            value: planName,
            hint: "Suscripción activa",
            tone: "neutral",
        },
        {
            label: "Agentes/clientes activos",
            value: formatNumber(actives),
            hint: "Usuarios operando actualmente",
            tone: "neutral",
        },
        {
            label: "Tickets este mes",
            value: formatNumber(tickets?.items.length),
            hint: "Volumen del periodo actual",
            tone: "neutral",
        },
        {
            label: "Salud de SLA",
            value: `${slaHealth}%`,
            hint: "Cumplimiento general",
            tone: getSlaTone(slaHealth),
        },
    ];

    const completedChecklist = checklist.filter((item) => item.done).length;
    const checklistProgress = checklist.length
        ? Math.round((completedChecklist / checklist.length) * 100)
        : 0;

    return (
        <section className={styles.screen}>
            <header className={styles.header}>
                <div>
                    <h3 className={styles.title}>Resumen</h3>
                    <p className={styles.description}>
                        Vista general del estado del workspace, uso actual y
                        configuración clave.
                    </p>
                </div>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <article
                        key={stat.label}
                        className={`${styles.statCard} ${styles[`tone-${stat.tone ?? "neutral"}`]}`}
                    >
                        <span className={styles.statLabel}>{stat.label}</span>
                        <strong className={styles.statValue}>{stat.value}</strong>
                        {stat.hint ? <span className={styles.statHint}>{stat.hint}</span> : null}
                    </article>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.mainColumn}>
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Estado del workspace</h4>
                                <p className={styles.cardSubtitle}>
                                    Configuración operativa principal y cobertura actual.
                                </p>
                            </div>
                            <div className={styles.cardBadge}>
                                <ShieldCheck size={16} />
                                <span>Estable</span>
                            </div>
                        </div>

                        <div className={styles.workspaceGrid}>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <Building2 size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Workspace</span>
                                    <strong className={styles.infoValue}>{workspace?.name}</strong>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <FolderKanban size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Subdominio</span>
                                    <strong className={styles.infoValue}>
                                        {workspace?.url}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <Users size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Departamentos</span>
                                    <strong className={styles.infoValue}>
                                        {formatNumber(departments?.items?.length)}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>
                                        Reglas de escalamiento
                                    </span>
                                    <strong className={styles.infoValue}>
                                        {formatNumber(scalationRules?.items?.length)}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <LifeBuoy size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Canales conectados</span>
                                    <strong className={styles.infoValue}>
                                        {formatNumber(connectedChannelsCount)}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Plan</span>
                                    <strong className={styles.infoValue}>{planName}</strong>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Actividad reciente</h4>
                                <p className={styles.cardSubtitle}>
                                    Cambios recientes del sistema y movimiento administrativo.
                                </p>
                            </div>
                        </div>

                        <div className={styles.activityList}>
                            {recentActivity.map((item) => (
                                <div key={item.id} className={styles.activityItem}>
                                    <div className={styles.activityDot} />
                                    <div className={styles.activityBody}>
                                        <div className={styles.activityTop}>
                                            <strong className={styles.activityTitle}>
                                                {item.title}
                                            </strong>
                                            <span className={styles.activityTime}>{item.time}</span>
                                        </div>
                                        <p className={styles.activityDescription}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>

                <aside className={styles.sideColumn}>
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Checklist de configuración</h4>
                                <p className={styles.cardSubtitle}>
                                    Progreso de configuración base del workspace.
                                </p>
                            </div>
                            <strong className={styles.progressValue}>
                                {checklistProgress}%
                            </strong>
                        </div>

                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${checklistProgress}%` }}
                            />
                        </div>

                        <div className={styles.checklist}>
                            {checklist.map((item) => (
                                <div key={item.id} className={styles.checkItem}>
                                    {item.done ? (
                                        <CheckCircle2
                                            size={16}
                                            className={styles.checkDoneIcon}
                                        />
                                    ) : (
                                        <CircleAlert
                                            size={16}
                                            className={styles.checkPendingIcon}
                                        />
                                    )}
                                    <span
                                        className={
                                            item.done
                                                ? styles.checkDoneText
                                                : styles.checkPendingText
                                        }
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Acciones rápidas</h4>
                                <p className={styles.cardSubtitle}>
                                    Atajos para tareas administrativas frecuentes.
                                </p>
                            </div>
                        </div>

                        <div className={styles.quickActions}>
                            {quickActions.map((action) => (
                                <Button
                                    key={action.id}
                                    type="button"
                                    variant={action.variant === "primary" ? "primary" : "secondary"}
                                    icon={action.variant === "primary" ? <Plus size={16} /> : undefined}
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </article>

                    <article className={styles.tipCard}>
                        <div className={styles.tipIconWrap}>
                            <Ticket size={18} />
                        </div>
                        <div>
                            <strong className={styles.tipTitle}>
                                Siguiente recomendación
                            </strong>
                            <p className={styles.tipText}>
                                Configure al menos una regla de escalamiento para reducir
                                tiempos muertos y mantener el cumplimiento del SLA.
                            </p>
                        </div>
                    </article>
                </aside>
            </div>
        </section>
    );
};

export default Overview;