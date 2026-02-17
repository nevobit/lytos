"use client";

import Link from "next/link";
// import { logout } from "./actions";
import styles from "./Header.module.css";


export function HeaderClient() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.brand}>
                    <span className={styles.brandMark} aria-hidden="true" />
                    <span className={styles.brandText}>Lytos</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/products" className={styles.navLink}>Plataforma</Link>
                    <Link href="/categories" className={styles.navLink}>Soluciones</Link>
                    <Link href="/about" className={styles.navLink}>Precios</Link>
                    <Link href="/about" className={styles.navLink}>Recursos</Link>
                    <Link href="/about" className={styles.navLink}>Contacto</Link>

                </nav>


                <div className={styles.actions}>
                    <Link href='/'>Iniciar sesión</Link>
                    <Link href='/'>Registrarse</Link>
                </div>
            </div>
        </header>
    );
}
