import React from "react";
import styles from "./Sidebar.module.css";
import {
    LayoutDashboard,
    Ticket,
    HelpCircle,
    ChevronDown,
    Boxes,
    User,
    Footprints,
    LogOut,
    Repeat,
} from "lucide-react";
import { useSession } from "@/shared";
import { Avatar, Menus } from "@lytos/design-system";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
};

const NAV: NavItem[] = [
    { label: "Primeros pasos", href: "/setup", icon: Footprints },
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Departamentos", href: PrivateRoutes.DEPARTMENTS, icon: Boxes },
    { label: "Tickets", href: PrivateRoutes.TICKETS, icon: Ticket },
    { label: "Clientes", href: "/customers", icon: User },

    // { label: "Inbox", href: '/inbox', icon: Inbox },
    // { label: "Notification", href: '/notifications', icon: Bell },
    // { label: "Knowledge Base", href: '/knowledge', icon: BookOpen },
    // { label: "Forum", href: '/forum', icon: MessagesSquare },
    // { label: "Report", href: '/report', icon: BarChart3 },
];

const Sidebar = () => {
    const { workspace, signOut, changeAccount } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        signOut();
        navigate("/signin");
    };

    const isRouteActive = (href: string) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname === href || location.pathname.startsWith(`${href}/`);
    };

    const handleSwitchAccount = () => {
        changeAccount();
        navigate("/accounts");
    };

    return (
        <aside className={styles.sidebar} aria-label="Sidebar">
            <Menus>
                <Menus.Menu>
            <div className={styles.workspace}>

                <Avatar name={workspace?.name} />

                <div className={styles.workspaceText}>
                    <div className={styles.workspaceNameRow}>
                        <div className={styles.workspaceName}>{workspace?.name}</div>
                    </div>
                    <div className={styles.workspaceRole}>Agent Admin</div>
                </div>
                        <Menus.Toggle id={`workspace-menu`} className={styles.actionToggle}>
                            <ChevronDown strokeWidth="1.5px" size={16} />
                        </Menus.Toggle>

                        <Menus.List id="workspace-menu" >
                            <Menus.Item
                                id={`change-account`}
                                leadingIcon={<Repeat size={16} strokeWidth="1.5px" />}
                                onClick={handleSwitchAccount}
                                role="menuitem"
                            >
                                Cambiar cuenta
                            </Menus.Item>

                            <Menus.Item
                                id={`signout`}
                                leadingIcon={<LogOut size={14} strokeWidth="1.5px" />}
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </Menus.Item>

                        </Menus.List>

                    </div>
                </Menus.Menu>
            </Menus>

            <nav className={styles.nav} aria-label="Main navigation">
                {NAV.map(({ label, href, icon: Icon }) => {
                    const active = isRouteActive(href);

                    return (
                        <Link
                            key={label}
                            to={href}
                            className={active ? styles.navItemActive : styles.navItem}
                        >
                            <Icon size={16} className={styles.navIcon} />
                            <span className={styles.navLabel}>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>CONVERSACIÓN</div>
                <div className={styles.conversationList}></div>
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
                    <button type="button" className={styles.linkBtn}>
                        Desanclar todo
                    </button>
                </div>

                <div className={styles.pinnedList}>
                    <button type="button" className={styles.addNew}>
                        +&nbsp;&nbsp;Agregar nuevo
                    </button>
                </div>
            </div>

            <div className={styles.bottom}>
                <button type="button" className={styles.helpRow}>
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