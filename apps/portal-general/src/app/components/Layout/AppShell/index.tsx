import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import styles from "./AppShell.module.css";

const AppShell = () => {
    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}><Sidebar /></aside>

            <div className={styles.main}>
                <main className={styles.content}><Outlet /></main>
            </div>
        </div>
    );
};

export default AppShell;
