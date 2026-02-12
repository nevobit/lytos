import React from "react";
import styles from "./Sidebar.module.css";
import {
    LayoutDashboard,
    Inbox,
    Bell,
    Ticket,
    BookOpen,
    User,
    MessagesSquare,
    BarChart3,
    Phone,
    MessageCircle,
    HelpCircle,
    Pin,
    MoreVertical,
    ChevronDown,
} from "lucide-react";
import { useSession } from "@/shared";
import { Avatar } from "@lytos/design-system";

type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
    active?: boolean;
};

const NAV: NavItem[] = [
    { label: "Dashboard", href: '/', icon: LayoutDashboard },
    { label: "Inbox", href: '/inbox', icon: Inbox },
    { label: "Notification", href: '/notifications', icon: Bell },
    { label: "Ticket", href: '/tickets', icon: Ticket, active: true },
    { label: "Knowledge Base", href: '/knowledge', icon: BookOpen },
    { label: "Customer", href: '/customers', icon: User },
    { label: "Forum", href: '/forum', icon: MessagesSquare },
    { label: "Report", href: '/report', icon: BarChart3 },
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
                    <a
                        key={label}
                        href={href}
                        className={active ? styles.navItemActive : styles.navItem}
                    >
                        <Icon size={16} className={styles.navIcon} />
                        <span className={styles.navLabel}>{label}</span>
                    </a>
                ))}
            </nav>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>CONVERSATION</div>

                <div className={styles.conversationList}>
                    <button className={styles.convItem}>
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
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>FAVORITES</div>
                <div className={styles.mutedHelp}>
                    Hover over any table and click the star to add it here.
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeaderRow}>
                    <div className={styles.sectionTitle}>PINNED TICKETS</div>
                    <button className={styles.linkBtn}>Unpin All</button>
                </div>

                <div className={styles.pinnedList}>
                    <button className={styles.pinnedItem}>
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
                    </button>

                    <button className={styles.addNew}>+&nbsp;&nbsp;Add new</button>
                </div>
            </div>

            <div className={styles.bottom}>
                <button className={styles.helpRow}>
                    <HelpCircle size={16} />
                    <span>Help &amp; Support</span>
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