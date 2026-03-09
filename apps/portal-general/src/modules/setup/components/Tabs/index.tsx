import { NavLink, Outlet } from 'react-router-dom';
import styles from './Tabs.module.css'

export const settingsTabs = [
    {
        key: "overview",
        label: "Resumen",
        to: "overview",
    },
    {
        key: "priorities",
        label: "Prioridades",
        to: "priorities",
    },
      {
        key: "types",
        label: "Tipos",
        to: "types",
    },
    {
        key: "categories",
        label: "Categorías",
        to: "categories",
    },
    {
        key: "statuses",
        label: "Estados",
        to: "statuses",
    },
    {
        key: "roles",
        label: "Roles",
        to: "roles",
    },
    {
        key: "cases",
        label: "Reglas de escalamiento",
        to: "cases",
    },
    {
        key: "billing",
        label: "Facturación",
        to: "billing",
    },
    {
        key: "users",
        label: "Agentes",
        to: "users",
    },
];

const Tabs = () => {
    return (
        <div>
            <nav className={styles.tabs} aria-label="Configuración">
                {settingsTabs.map((tab) => (
                    <NavLink
                        key={tab.key}
                        to={tab.to}
                        end
                        className={({ isActive }) =>
                            isActive ? `${styles.tab} ${styles.tabActive}` : `${styles.tab}`
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.tabPanel}>
                <Outlet />
            </div>
        </div>
    )
}

export default Tabs