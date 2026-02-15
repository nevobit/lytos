import Link from 'next/link';
import styles from './Footer.module.css';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export async function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.mainFooter} >
                <h2 className={styles.ctaTitle}>
                    ¿Listo para poner orden<br />
                    en tu soporte?
                </h2>
            </div>
            <div className={styles.middleFooter} >
                <ul>
                    <li>
                        <h3 className={styles.logo}>Lytos</h3>
                    </li>
                    <li><p>Centraliza tickets, conversaciones <br /> y equipos en una sola consola.</p></li>
                    <li><div className={styles.social}>
                        <span><Facebook /></span>
                        <span><Linkedin /></span>
                        <span><Instagram /></span>
                        <span><Twitter /></span>
                    </div></li>
                </ul>
                <ul>
                    <li>
                        <h3>Inicio</h3>
                    </li>
                    <li>Caracterisitcas</li>
                    <li>Beneficios</li>
                    <li>Como se usa</li>
                    <li>Caracteristicas Clave</li>
                    <li>Precios</li>
                </ul>
                <ul>
                    <li>
                        <h3>Sobre nosotros</h3>
                    </li>
                    <li>App Mobile</li>
                    <li>App Escritorio</li>
                    <li>Testimonios</li>
                    <li>Politicas de Privacidad</li>
                    <li>Precios</li>
                </ul>
                <ul>
                    <li>
                        <h3>Paginas</h3>
                    </li>
                    <li>Inicio</li>
                    <li>App</li>
                    <li>Blog</li>
                    <li>Blog Abierto</li>
                    <li>Contact</li>
                </ul>
                <ul>
                    <li><h3>Descarga nuestra App</h3></li>
                    <li><button className={styles.btn} >Google Play</button></li>
                    <li><button className={styles.btn} >App Store</button></li>
                </ul>

            </div>
            <div className={styles.bottomFooter} >
                {new Date().getFullYear()} Lytos. Todos los derechos reservados.
                <Link href='/' >Politicas de Privacidad</Link>
                <Link href='/' >Terminos de Servicio</Link>
            </div>
        </div>
    )
}
