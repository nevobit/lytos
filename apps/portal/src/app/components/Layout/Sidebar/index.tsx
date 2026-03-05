import React from "react";
import styles from "./Sidebar.module.css";
import {
    LayoutDashboard,
    // Inbox,
    // Bell,
    Ticket,
    // BookOpen,
    // User,
    // MessagesSquare,
    // BarChart3,
    // Phone,
    // MessageCircle,
    HelpCircle,
    // Pin,
    // MoreVertical,
    ChevronDown,
    Boxes,
} from "lucide-react";
import { useSession } from "@/shared";
import { Avatar } from "@lytos/design-system";
import { Link } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
    active?: boolean;
};

const NAV: NavItem[] = [
    { label: "Dashboard", href: '/', icon: LayoutDashboard },
    { label: "Departamentos", href: PrivateRoutes.DEPARTMENTS, icon: Boxes },
    { label: "Tickets", href: PrivateRoutes.TICKETS, icon: Ticket },

    // { label: "Inbox", href: '/inbox', icon: Inbox },
    // { label: "Notification", href: '/notifications', icon: Bell },
    // { label: "Knowledge Base", href: '/knowledge', icon: BookOpen },
    // { label: "Customer", href: '/customers', icon: User },
    // { label: "Forum", href: '/forum', icon: MessagesSquare },
    // { label: "Report", href: '/report', icon: BarChart3 },
];

const Sidebar = () => {
    const { workspace } = useSession();
    return (
        <aside className={styles.sidebar} aria-label="Sidebar">
            <div className={styles.workspace}>
                <Avatar name={workspace?.name} />


                <div className={styles.workspaceText}>
                    <div className={styles.workspaceNameRow}>
                        <div className={styles.workspaceName}>{workspace?.name}</div>
                    </div>
                    <div className={styles.workspaceRole}>Agent Admin</div>
                </div>

                <button className={styles.workspaceMenu} aria-label="Workspace menu">
                    <ChevronDown size={16} />
                </button>
            </div>

            <nav className={styles.nav} aria-label="Main navigation">
                {NAV.map(({ label, href, icon: Icon, active }) => (
                    <Link
                        key={label}
                        to={href}
                        className={active ? styles.navItemActive : styles.navItem}
                    >
                        <Icon size={16} className={styles.navIcon} />
                        <span className={styles.navLabel}>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>CONVERSACIÓN</div>

                <div className={styles.conversationList}>
                    {/* <button className={styles.convItem}>
                        <div className={styles.convIcon}>
                            <Phone size={16} />
                        </div>

                        <div className={styles.convText}>
                            <div className={styles.convTitle}>Call</div>
                            <div className={styles.convSub}>(123)45678…</div>
                        </div>

                        <span className={styles.badgeDanger} aria-label="1 unread">
                            1
                        </span>
                    </button>

                    <button className={styles.convItem}>
                        <div className={styles.convIcon}>
                            <MessageCircle size={16} />
                        </div>

                        <div className={styles.convText}>
                            <div className={styles.convTitle}>Side Conversa…</div>
                            <div className={styles.convSub}>-</div>
                        </div>

                        <span className={styles.badgeMuted} aria-label="0 unread">
                            0
                        </span>
                    </button> */}
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>FAVORITOS</div>
                <div className={styles.mutedHelp}>
                    Coloque el cursor sobre cualquier tabla y haga clic en la estrella para agregarla aquí.
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeaderRow}>
                    <div className={styles.sectionTitle}>TICKETS FIJADOS</div>
                    <button className={styles.linkBtn}>Desanclar todo</button>
                </div>

                <div className={styles.pinnedList}>
                    {/* <button className={styles.pinnedItem}>
                        <span className={styles.pinnedLeft}>
                            <Pin size={14} className={styles.pinIcon} />
                            <span className={styles.pinnedLabel}>#TC-192 produc…</span>
                        </span>

                        <MoreVertical size={16} className={styles.pinnedMore} />
                    </button>

                    <button className={styles.pinnedItem}>
                        <span className={styles.pinnedLeft}>
                            <Pin size={14} className={styles.pinIcon} />
                            <span className={styles.pinnedLabel}>#TC-191 paymen…</span>
                        </span>

                        <MoreVertical size={16} className={styles.pinnedMore} />
                    </button>

                    <button className={styles.pinnedItem}>
                        <span className={styles.pinnedLeft}>
                            <Pin size={14} className={styles.pinIcon} />
                            <span className={styles.pinnedLabel}>+ 1 678-908-78…</span>
                        </span>

                        <MoreVertical size={16} className={styles.pinnedMore} />
                    </button> */}

                    <button className={styles.addNew}>+&nbsp;&nbsp;Agregar nuevo</button>
                </div>
            </div>

            <div className={styles.bottom}>
                <button className={styles.helpRow}>
                    <HelpCircle size={16} />
                    <span>Ayuda &amp; Soporte</span>
                </button>

                <div className={styles.poweredBy}>
                    <div className={styles.poweredLabel}>POWERED BY</div>
                    <div className={styles.poweredBrand}>
                        <span className={styles.poweredDot} />
                        <strong>Nevobit</strong>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;