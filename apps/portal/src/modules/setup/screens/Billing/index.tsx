import { Button } from "@lytos/design-system";
import {
    AlertTriangle,
    CheckCircle2,
    CreditCard,
    Download,
    FileText,
    Receipt,
    ShieldCheck,
    Users,
    Wallet,
} from "lucide-react";
import styles from "./Billing.module.css";

type BillingStat = {
    label: string;
    value: string;
    hint?: string;
};

type InvoiceStatus = "paid" | "pending" | "failed";

type Invoice = {
    id: string;
    date: string;
    number: string;
    status: InvoiceStatus;
    total: string;
};

type BillingProps = {
    planName?: string;
    planPrice?: string;
    subscriptionStatus?: string;
    nextChargeDate?: string;
    billableAgents?: number;
    estimatedMonthTotal?: string;
    includedAgents?: number;
    usedAgents?: number;
    includedTickets?: number;
    usedTickets?: number;
    activeRules?: number;
    paymentMethodLabel?: string;
    billingContactName?: string;
    billingContactEmail?: string;
    companyName?: string;
    invoices?: Invoice[];
};

const defaultInvoices: Invoice[] = [
    {
        id: "1",
        date: "01 Mar 2026",
        number: "INV-2026-031",
        status: "paid",
        total: "$49 USD",
    },
    {
        id: "2",
        date: "01 Feb 2026",
        number: "INV-2026-018",
        status: "paid",
        total: "$49 USD",
    },
    {
        id: "3",
        date: "01 Ene 2026",
        number: "INV-2026-004",
        status: "paid",
        total: "$49 USD",
    },
];

const formatNumber = (value: number) => new Intl.NumberFormat("es-CO").format(value);

const getUsagePercentage = (used: number, included: number) => {
    if (!included) return 0;
    return Math.min(100, Math.round((used / included) * 100));
};

const getInvoiceStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
        case "paid":
            return "Pagada";
        case "pending":
            return "Pendiente";
        case "failed":
            return "Fallida";
        default:
            return status;
    }
};

const Billing = ({
    planName = "Growth",
    planPrice = "$49 USD / mes",
    subscriptionStatus = "Activa",
    nextChargeDate = "01 Abr 2026",
    billableAgents = 12,
    estimatedMonthTotal = "$49 USD",
    includedAgents = 15,
    usedAgents = 12,
    includedTickets = 2500,
    usedTickets = 1284,
    activeRules = 2,
    paymentMethodLabel = "Visa terminada en 4242",
    billingContactName = "Néstor Mosquera",
    billingContactEmail = "billing@nevobit.com",
    companyName = "Nevobit LLC",
    invoices = defaultInvoices,
}: BillingProps) => {
    const stats: BillingStat[] = [
        {
            label: "Plan actual",
            value: planName,
            hint: subscriptionStatus,
        },
        {
            label: "Próximo cobro",
            value: nextChargeDate,
            hint: "Fecha estimada",
        },
        {
            label: "Agentes facturables",
            value: formatNumber(billableAgents),
            hint: "Usuarios incluidos en cobro",
        },
        {
            label: "Total estimado del mes",
            value: estimatedMonthTotal,
            hint: "Antes de impuestos",
        },
    ];

    const agentsUsage = getUsagePercentage(usedAgents, includedAgents);
    const ticketsUsage = getUsagePercentage(usedTickets, includedTickets);

    return (
        <section className={styles.screen}>
            <header className={styles.header}>
                <div>
                    <h3 className={styles.title}>Facturación</h3>
                    <p className={styles.description}>
                        Administre su plan, consumo, métodos de pago y facturas.
                    </p>
                </div>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <article key={stat.label} className={styles.statCard}>
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
                                <h4 className={styles.cardTitle}>Plan actual</h4>
                                <p className={styles.cardSubtitle}>
                                    Información principal de la suscripción activa.
                                </p>
                            </div>
                            <div className={styles.statusBadge}>
                                <CheckCircle2 size={16} />
                                <span>{subscriptionStatus}</span>
                            </div>
                        </div>

                        <div className={styles.planBlock}>
                            <div className={styles.planMain}>
                                <div className={styles.planIcon}>
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <strong className={styles.planName}>{planName}</strong>
                                    <p className={styles.planDescription}>
                                        Un plan diseñado para equipos que requieren control,
                                        visibilidad y automatización operativa.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.planPriceWrap}>
                                <strong className={styles.planPrice}>{planPrice}</strong>
                                <span className={styles.planCycle}>Cobro recurrente mensual</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <Button type="button" variant="primary">
                                Cambiar plan
                            </Button>
                            <Button type="button" variant="secondary">
                                Administrar suscripción
                            </Button>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Facturas</h4>
                                <p className={styles.cardSubtitle}>
                                    Historial reciente de cobros y documentos emitidos.
                                </p>
                            </div>
                        </div>

                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Número</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td>{invoice.date}</td>
                                            <td>{invoice.number}</td>
                                            <td>
                                                <span
                                                    className={`${styles.invoiceStatus} ${styles[`status-${invoice.status}`]
                                                        }`}
                                                >
                                                    {getInvoiceStatusLabel(invoice.status)}
                                                </span>
                                            </td>
                                            <td>{invoice.total}</td>
                                            <td className={styles.actionCell}>
                                                <Button
                                                    type="button"
                                                    variant="plain"
                                                    icon={<Download size={16} />}
                                                >
                                                    Descargar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>

                <aside className={styles.sideColumn}>
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Uso actual</h4>
                                <p className={styles.cardSubtitle}>
                                    Consumo del plan durante el ciclo vigente.
                                </p>
                            </div>
                        </div>

                        <div className={styles.usageList}>
                            <div className={styles.usageItem}>
                                <div className={styles.usageTop}>
                                    <div className={styles.usageLabelWrap}>
                                        <Users size={16} />
                                        <span>Agentes</span>
                                    </div>
                                    <strong>
                                        {usedAgents} / {includedAgents}
                                    </strong>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${agentsUsage}%` }}
                                    />
                                </div>
                            </div>

                            <div className={styles.usageItem}>
                                <div className={styles.usageTop}>
                                    <div className={styles.usageLabelWrap}>
                                        <Receipt size={16} />
                                        <span>Tickets</span>
                                    </div>
                                    <strong>
                                        {formatNumber(usedTickets)} / {formatNumber(includedTickets)}
                                    </strong>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${ticketsUsage}%` }}
                                    />
                                </div>
                            </div>

                            <div className={styles.usageMeta}>
                                <div className={styles.metaRow}>
                                    <span>Reglas activas</span>
                                    <strong>{activeRules}</strong>
                                </div>
                                <div className={styles.metaRow}>
                                    <span>Estimado actual</span>
                                    <strong>{estimatedMonthTotal}</strong>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Método de pago</h4>
                                <p className={styles.cardSubtitle}>
                                    Información del método de cobro principal.
                                </p>
                            </div>
                        </div>

                        <div className={styles.infoStack}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Tarjeta principal</span>
                                    <strong className={styles.infoValue}>
                                        {paymentMethodLabel}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <Button type="button" variant="secondary">
                                Actualizar método de pago
                            </Button>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h4 className={styles.cardTitle}>Contacto de facturación</h4>
                                <p className={styles.cardSubtitle}>
                                    Datos usados para notificaciones y documentos.
                                </p>
                            </div>
                        </div>

                        <div className={styles.infoStack}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <Wallet size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Responsable</span>
                                    <strong className={styles.infoValue}>
                                        {billingContactName}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Correo de facturación</span>
                                    <strong className={styles.infoValue}>
                                        {billingContactEmail}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <Receipt size={16} />
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Empresa</span>
                                    <strong className={styles.infoValue}>{companyName}</strong>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <Button type="button" variant="secondary">
                                Editar datos
                            </Button>
                        </div>
                    </article>

                    <article className={styles.dangerCard}>
                        <div className={styles.dangerHeader}>
                            <AlertTriangle size={18} />
                            <strong>Zona delicada</strong>
                        </div>
                        <p className={styles.dangerText}>
                            Las acciones de suspensión o cancelación pueden afectar el acceso del
                            equipo y las automatizaciones activas.
                        </p>
                        <div className={styles.dangerActions}>
                            <Button type="button" variant="secondary">
                                Pausar suscripción
                            </Button>
                            <Button type="button" variant="plain">
                                Cancelar plan
                            </Button>
                        </div>
                    </article>
                </aside>
            </div>
        </section>
    );
};

export default Billing;