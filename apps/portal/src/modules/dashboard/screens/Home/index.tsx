import { useMemo, useState } from "react";
import styles from "./Home.module.css";
import { Button } from "@lytos/design-system";

type TrendDirection = "up" | "down";

type Kpi = {
    title: string; // UI (Spanish)
    value: number | string;
    trend: string;
    direction: TrendDirection;
};

type DayBucket = {
    label: string; // UI date label
    created: number;
    solved: number;
};

type PieSegment = {
    label: string; // UI (Spanish)
    value: number; // 0..100
    colorVar: string; // CSS var name e.g. "--green"
};

function formatNumberCL(n: number): string {
    return new Intl.NumberFormat("es-CL").format(n);
}

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function formatShortDayCL(d: Date): string {
    // "lun 05" (es-CL style)
    const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"] as const;
    return `${days[d.getDay()]} ${pad2(d.getDate())}`;
}

function getLast7DaysRange(): { rangeLabel: string; days: DayBucket[] } {
    const today = new Date();
    const days: DayBucket[] = [];

    for (let i = 6; i >= 0; i--) {
        const dt = new Date(today);
        dt.setDate(today.getDate() - i);
        days.push({
            label: formatShortDayCL(dt),
            created: 0,
            solved: 0,
        });
    }

    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const rangeLabel = `${pad2(start.getDate())}/${pad2(start.getMonth() + 1)} - ${pad2(
        today.getDate()
    )}/${pad2(today.getMonth() + 1)}`;

    return { rangeLabel, days };
}

function TrendPill({ value, direction }: { value: string; direction: TrendDirection }) {
    const isUp = direction === "up";
    return (
        <span className={`${styles.trend} ${isUp ? styles.trendUp : styles.trendDown}`}>
            {isUp ? "▲" : "▼"} {value}
        </span>
    );
}

function MiniBarChart({ days }: { days: DayBucket[] }) {
    const max = Math.max(1, ...days.map((d) => d.created)); // avoid /0
    return (
        <div className={styles.barsWrap}>
            {days.map((d) => {
                const hCreated = Math.max(10, Math.round((d.created / max) * 100));
                const hSolved = Math.max(10, Math.round((d.solved / max) * 100));
                return (
                    <div key={d.label} className={styles.barCol}>
                        <div className={styles.barStack}>
                            <div className={styles.barCreated} style={{ height: `${hCreated}%` }} />
                            <div className={styles.barSolved} style={{ height: `${hSolved}%` }} />
                        </div>
                        <div className={styles.barLabel}>{d.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

function PieChart({ segments }: { segments: PieSegment[] }) {
    const radius = 82;
    const cx = 98;
    const cy = 98;
    const C = 2 * Math.PI * radius;

    let acc = 0;
    const arcs = segments.map((s) => {
        const len = (s.value / 100) * C;
        const dasharray = `${len} ${C - len}`;
        const dashoffset = -(acc / 100) * C;
        acc += s.value;
        return { ...s, dasharray, dashoffset };
    });

    return (
        <div className={styles.pieWrap}>
            <svg width="196" height="196" viewBox="0 0 196 196" className={styles.pieSvg}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="22"
                    opacity="0.25"
                />
                {arcs.map((a) => (
                    <circle
                        key={a.label}
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="none"
                        stroke={`var(${a.colorVar})`}
                        strokeWidth="22"
                        strokeLinecap="butt"
                        strokeDasharray={a.dasharray}
                        strokeDashoffset={a.dashoffset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                    />
                ))}
            </svg>

            <div className={styles.pieLegend}>
                {segments.map((s) => (
                    <div key={s.label} className={styles.legendRow}>
                        <span className={styles.legendDot} style={{ background: `var(${s.colorVar})` }} />
                        <span className={styles.legendLabel}>{s.label}</span>
                        <span className={styles.legendValue}>{s.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Gauge({
    value,
    title,
    totalLabel,
    totalValue,
}: {
    value: number; // 0..100
    title: string; // UI
    totalLabel: string; // UI
    totalValue: number; // UI number
}) {
    const cx = 98;
    const r = 86;

    const startAngle = -210;
    const endAngle = 30;
    const sweep = endAngle - startAngle;
    const theta = startAngle + (sweep * value) / 100;

    const rad = (theta * Math.PI) / 180;
    const x2 = cx + Math.cos(rad) * (r - 10);
    const y2 = 104 + Math.sin(rad) * (r - 10);

    return (
        <div className={styles.gauge}>
            <div className={styles.gaugeTop}>
                <div className={styles.cardTitle}>{title}</div>
                <div className={styles.gaugeTitle}>{totalLabel}</div>
                <div className={styles.gaugeBig}>{formatNumberCL(totalValue)}</div>
            </div>

            <svg width="196" height="120" viewBox="0 0 196 120" className={styles.gaugeSvg}>
                <path
                    d="M 20 104 A 78 78 0 0 1 176 104"
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.3"
                />
                <path
                    d="M 20 104 A 78 78 0 0 1 176 104"
                    fill="none"
                    stroke="var(--blue)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray={`${value} 100`}
                />
                <line x1={cx} y1={104} x2={x2} y2={y2} stroke="var(--text)" strokeWidth="2.5" opacity="0.85" />
                <circle cx={cx} cy={104} r="5" fill="var(--text)" opacity="0.85" />
            </svg>

            <div className={styles.gaugeLegend}>
                <span className={styles.tag}>
                    <span className={styles.tagDot} style={{ background: "var(--blue)" }} /> Email
                </span>
                <span className={styles.tag}>
                    <span className={styles.tagDot} style={{ background: "var(--purple)" }} /> Chat en vivo
                </span>
                <span className={styles.tag}>
                    <span className={styles.tagDot} style={{ background: "var(--green)" }} /> Formulario
                </span>
                <span className={styles.tag}>
                    <span className={styles.tagDot} style={{ background: "var(--orange)" }} /> Messenger
                </span>
                <span className={styles.tag}>
                    <span className={styles.tagDot} style={{ background: "var(--teal)" }} /> WhatsApp
                </span>
            </div>
        </div>
    );
}

function SatisfactionCard({
    totalResponses,
    positive,
    neutral,
    negative,
}: {
    totalResponses: number;
    positive: number;
    neutral: number;
    negative: number;
}) {
    return (
        <div className={styles.satisfaction}>
            <div className={styles.satHeader}>
                <div className={styles.cardTitle}>Satisfacción del cliente</div>
            </div>

            <div className={styles.satGrid}>
                <div className={styles.satLeft}>
                    <div className={styles.satSmall}>Respuestas recibidas</div>
                    <div className={styles.satBig}>
                        {formatNumberCL(totalResponses)} <span className={styles.satBigMuted}>clientes</span>
                    </div>
                </div>

                <div className={styles.satRight}>
                    <div className={styles.satRow}>
                        <div className={styles.satRowLeft}>
                            <span className={`${styles.iconCircle} ${styles.good}`}>👍</span>
                            <div>
                                <div className={styles.satLabel}>Positivo</div>
                                <div className={styles.satValue}>{positive}%</div>
                            </div>
                        </div>
                        <div className={styles.progress}>
                            <div className={styles.progressFill} style={{ width: `${positive}%` }} />
                        </div>
                    </div>

                    <div className={styles.satRow}>
                        <div className={styles.satRowLeft}>
                            <span className={`${styles.iconCircle} ${styles.neutral}`}>👌</span>
                            <div>
                                <div className={styles.satLabel}>Neutral</div>
                                <div className={styles.satValue}>{neutral}%</div>
                            </div>
                        </div>
                        <div className={styles.progress}>
                            <div className={styles.progressFill} style={{ width: `${neutral}%` }} />
                        </div>
                    </div>

                    <div className={styles.satRow}>
                        <div className={styles.satRowLeft}>
                            <span className={`${styles.iconCircle} ${styles.bad}`}>👎</span>
                            <div>
                                <div className={styles.satLabel}>Negativo</div>
                                <div className={styles.satValue}>{negative}%</div>
                            </div>
                        </div>
                        <div className={styles.progress}>
                            <div className={styles.progressFill} style={{ width: `${negative}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SupportDashboard(): JSX.Element {
    const { rangeLabel, days } = useMemo(() => getLast7DaysRange(), []);
    const [range, setRange] = useState<string>(rangeLabel);

    const kpis: Kpi[] = useMemo(
        () => [
            { title: "Tickets creados", value: 0, trend: "0%", direction: "up" },
            { title: "Tickets sin resolver", value: 0, trend: "0%", direction: "up" },
            { title: "Tickets resueltos", value: 0, trend: "0%", direction: "up" },
            { title: "Tiempo promedio de primera respuesta", value: "0 min", trend: "0%", direction: "up" },
        ],
        []
    );

    const pieSegments: PieSegment[] = useMemo(
        () => [
            { label: "0–1 hora", value: 0, colorVar: "--green" },
            { label: "1–8 horas", value: 0, colorVar: "--orange" },
            { label: "8–24 horas", value: 0, colorVar: "--purple" },
            { label: ">24 horas", value: 0, colorVar: "--blue" },
            { label: "Sin respuesta", value: 0, colorVar: "--red" },
        ],
        []
    );

    return (
        <div className={styles.page}>
            <div className={styles.shell}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.hLeft}>
                        <div className={styles.hTitle}>Dashboard</div>
                    </div>
                    <div className={styles.hRight}>
                        <Button>Exportar CSV</Button>
                        {/* <button className={styles.csvBtn} type="button">
                            Exportar CSV <span className={styles.chev}>▾</span>
                        </button> */}
                    </div>
                </div>

                {/* Top KPIs */}
                <div className={styles.topGrid}>
                    {kpis.map((k) => (
                        <div key={k.title} className={styles.kpiCard}>
                            <div className={styles.kpiTop}>
                                <div className={styles.kpiTitle}>{k.title}</div>
                            </div>

                            <div className={styles.kpiValueRow}>
                                <div className={styles.kpiValue}>
                                    {typeof k.value === "number" ? formatNumberCL(k.value) : k.value}
                                </div>
                                <TrendPill value={k.trend} direction={k.direction} />
                            </div>

                            <div className={styles.kpiSub}>Comparado con el mes pasado</div>
                        </div>
                    ))}
                </div>

                {/* Middle */}
                <div className={styles.midGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>Promedio de tickets creados</div>

                            {/* placeholder: range selector */}
                            <select className={styles.select} value={range} onChange={(e) => setRange(e.target.value)}>
                                <option value={rangeLabel}>{rangeLabel}</option>
                            </select>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.leftStats}>
                                <div className={styles.statBlock}>
                                    <div className={styles.statLabel}>Prom. tickets creados</div>
                                    <div className={styles.statValue}>{formatNumberCL(0)}</div>
                                </div>

                                <div className={styles.statBlock}>
                                    <div className={styles.statLabel}>Prom. tickets resueltos</div>
                                    <div className={styles.statValue}>{formatNumberCL(0)}</div>
                                </div>
                            </div>

                            <div className={styles.chartArea}>
                                <div className={styles.chartGridLines}>
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <MiniBarChart days={days} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>Tickets por tiempo de primera respuesta</div>
                        </div>
                        <div className={styles.cardBodyOnly}>
                            <PieChart segments={pieSegments} />
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className={styles.botGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>Tickets por canal</div>
                        </div>
                        <div className={styles.cardBodyOnly}>
                            <Gauge value={0} title="Tickets por canal" totalLabel="Total de tickets activos" totalValue={0} />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardBodyOnly}>
                            <SatisfactionCard totalResponses={0} positive={0} neutral={0} negative={0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}