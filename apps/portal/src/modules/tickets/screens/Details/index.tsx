import { useMemo, useState } from "react";
import styles from "./Details.module.css";
import {
    ArrowLeft,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Circle,
    Clock3,
    Headphones,
    MessagesSquare,
    Send,
    Ticket,
    UserRound,
    FileText,
    Paperclip,
    Smile,
    Mic,
    AtSign,
} from "lucide-react";

type TabKey = "conversation" | "task" | "activity" | "notes";
type Channel = "WhatsApp" | "Email" | "Web" | "Interno";

type TicketMessage = {
    id: string;
    type: "message" | "system";
    author: string;
    role?: "customer" | "agent" | "system";
    content?: string;
    time: string;
    channel?: Channel;
    event?: string;
    accent?: "blue" | "orange" | "gray";
};

const timeline: TicketMessage[] = [
    {
        id: "1",
        type: "system",
        author: "Sistema",
        time: "11:07 AM",
        event: "Ticket creado · Santi se contactó por primera vez",
        accent: "blue",
    },
    {
        id: "2",
        type: "message",
        author: "Santi Cazorla",
        role: "customer",
        time: "11:12 AM",
        channel: "WhatsApp",
        content:
            "Hola, hace poco hice una compra en su sitio web, pero lamentablemente pedí el producto equivocado. ¿Me pueden ayudar a cancelar el pedido?",
    },
    {
        id: "3",
        type: "system",
        author: "Fikri Studio",
        time: "11:09 AM",
        event: "Abrió el ticket",
        accent: "gray",
    },
    {
        id: "4",
        type: "message",
        author: "Fikri Studio",
        role: "agent",
        time: "11:12 AM",
        channel: "WhatsApp",
        content:
            "Hola, lamento lo ocurrido. ¿Me puedes compartir tu número de pedido para ayudarte mejor?",
    },
    {
        id: "5",
        type: "message",
        author: "Santi Cazorla",
        role: "customer",
        time: "11:12 AM",
        channel: "WhatsApp",
        content: "Claro, el número del pedido es TC-192.",
    },
    {
        id: "6",
        type: "message",
        author: "Fikri Studio",
        role: "agent",
        time: "11:12 AM",
        channel: "WhatsApp",
        content:
            "Gracias por compartirlo. ¿Me puedes indicar qué producto querías pedir en realidad?",
    },
    {
        id: "7",
        type: "message",
        author: "Santi Cazorla",
        role: "customer",
        time: "11:12 AM",
        channel: "WhatsApp",
        content:
            "Sí, quería pedir la carcasa azul para iPhone, pero por error pedí la roja.",
    },
    {
        id: "8",
        type: "system",
        author: "Fikri Studio",
        time: "13:12 AM",
        event: "Cambió la prioridad del ticket a Urgente",
        accent: "orange",
    },
    {
        id: "9",
        type: "system",
        author: "Fikri Studio",
        time: "13:14 AM",
        event: "Cambió el tipo de ticket a Incidente",
        accent: "gray",
    },
    {
        id: "10",
        type: "message",
        author: "Fikri Studio",
        role: "agent",
        time: "11:12 AM",
        channel: "WhatsApp",
        content:
            "Perfecto. Para cancelar el pedido, tienes que iniciar sesión en tu cuenta en nuestro sitio web. Una vez dentro, anda a tu historial de pedidos y selecciona el pedido de la carcasa roja. Desde ahí deberías ver la opción para cancelar el artículo.",
    },
];

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getAvatarTone(role?: TicketMessage["role"]) {
    if (role === "agent") return styles.avatarAgent;
    if (role === "customer") return styles.avatarCustomer;
    return styles.avatarSystem;
}

function getSystemAccent(accent?: TicketMessage["accent"]) {
    if (accent === "blue") return styles.systemIconBlue;
    if (accent === "orange") return styles.systemIconOrange;
    return styles.systemIconGray;
}

export default function TicketDetailScreen() {
    const [activeTab, setActiveTab] = useState<TabKey>("conversation");
    const [reply, setReply] = useState("");

    const tabContent = useMemo(() => {
        if (activeTab === "conversation") {
            return (
                <div className={styles.timeline}>
                    {timeline.map((item) => {
                        if (item.type === "system") {
                            return (
                                <div key={item.id} className={styles.systemRow}>
                                    <div className={styles.systemLine} />
                                    <div className={`${styles.systemIcon} ${getSystemAccent(item.accent)}`}>
                                        <Circle size={10} fill="currentColor" />
                                    </div>
                                    <div className={styles.systemBody}>
                                        <span className={styles.systemEvent}>{item.event}</span>
                                        <span className={styles.systemTime}>· {item.time}</span>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className={styles.messageRow}>
                                <div className={`${styles.avatar} ${getAvatarTone(item.role)}`}>
                                    {initials(item.author)}
                                </div>

                                <div className={styles.messageContent}>
                                    <div className={styles.messageMeta}>
                                        <strong>{item.author}</strong>
                                        <span>· {item.time}</span>
                                        {item.channel ? (
                                            <span className={styles.channelBadge}>vía {item.channel}</span>
                                        ) : null}
                                    </div>

                                    <div className={styles.bubble}>
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (activeTab === "task") {
            return (
                <div className={styles.emptyState}>
                    <h3>No hay tareas todavía</h3>
                    <p>Crea tareas internas para seguimiento, escalamiento o gestión postventa.</p>
                </div>
            );
        }

        if (activeTab === "activity") {
            return (
                <div className={styles.emptyState}>
                    <h3>Registro de actividad</h3>
                    <p>
                        Acá puedes mostrar cambios de estado, asignaciones, SLA, etiquetas y eventos
                        de automatización.
                    </p>
                </div>
            );
        }

        return (
            <div className={styles.emptyState}>
                <h3>Notas privadas</h3>
                <p>Notas internas solo para agentes. El cliente no ve esta información.</p>
            </div>
        );
    }, [activeTab]);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <button className={styles.iconButton} aria-label="Volver">
                            <ArrowLeft size={18} />
                        </button>

                        <div className={styles.breadcrumb}>Lista de tickets</div>
                    </div>

                    <div className={styles.topbarCenter}>
                        <button className={styles.iconButton} aria-label="Ticket anterior">
                            <ChevronLeft size={18} />
                        </button>

                        <button className={styles.iconButton} aria-label="Siguiente ticket">
                            <ChevronRight size={18} />
                        </button>

                        <div className={styles.ticketTitleWrap}>
                            <span className={styles.ticketId}>#TC-192</span>
                            <h1 className={styles.ticketTitle}>Ayuda, hice un pedido equivocado</h1>
                        </div>
                    </div>

                    <div className={styles.topbarRight}>
                        <div className={styles.headerGhost} />
                        <button className={styles.closeButton}>
                            <span>Marcar como cerrado</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </header>

                <section className={styles.content}>
                    <div className={styles.ticketCard}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === "conversation" ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab("conversation")}
                            >
                                Conversación
                            </button>

                            <button
                                className={`${styles.tab} ${activeTab === "task" ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab("task")}
                            >
                                Tareas
                            </button>

                            <button
                                className={`${styles.tab} ${activeTab === "activity" ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab("activity")}
                            >
                                Actividad
                            </button>

                            <button
                                className={`${styles.tab} ${activeTab === "notes" ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab("notes")}
                            >
                                Notas
                            </button>
                        </div>

                        <div className={styles.body}>{tabContent}</div>

                        <div className={styles.composer}>
                            <div className={styles.composerTopRow}>
                                <div className={styles.selectLike}>
                                    <span>Vía</span>
                                    <strong>WhatsApp</strong>
                                    <ChevronDown size={14} />
                                </div>

                                <div className={styles.selectLike}>
                                    <span>Desde</span>
                                    <strong>Soporte Fikri Studio</strong>
                                    <ChevronDown size={14} />
                                </div>

                                <button className={styles.iconButton} aria-label="Opciones de atención">
                                    <Headphones size={16} />
                                </button>
                            </div>

                            <textarea
                                className={styles.textarea}
                                placeholder='Escribe un comentario o "/" para usar comandos'
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />

                            <div className={styles.composerBottomRow}>
                                <div className={styles.tools}>
                                    <button className={styles.iconButton} aria-label="Mencionar">
                                        <AtSign size={16} />
                                    </button>
                                    <button className={styles.iconButton} aria-label="Adjuntar archivo">
                                        <Paperclip size={16} />
                                    </button>
                                    <button className={styles.iconButton} aria-label="Emoji">
                                        <Smile size={16} />
                                    </button>
                                    <button className={styles.iconButton} aria-label="Audio">
                                        <Mic size={16} />
                                    </button>

                                    <button className={styles.macroButton}>
                                        Macros
                                        <ChevronDown size={14} />
                                    </button>
                                </div>

                                <div className={styles.actions}>
                                    <button className={styles.endChat}>Terminar chat</button>
                                    <button className={styles.sendButton}>
                                        <Send size={15} />
                                        <span>Enviar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.actionRail}>
                        <button className={styles.railButton} aria-label="SLA o tiempos">
                            <Clock3 size={16} />
                        </button>
                        <button className={styles.railButton} aria-label="Detalle">
                            <FileText size={16} />
                        </button>
                        <button className={styles.railButton} aria-label="Cliente">
                            <UserRound size={16} />
                        </button>
                        <button className={styles.railButton} aria-label="Ticket">
                            <Ticket size={16} />
                        </button>
                        <button className={styles.railButton} aria-label="Conversaciones">
                            <MessagesSquare size={16} />
                        </button>
                    </aside>
                </section>
            </main>
        </div>
    );
}