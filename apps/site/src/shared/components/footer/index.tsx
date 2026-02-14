import Link from 'next/link';
import styles from './Footer.module.css';

export async function Footer() {
    return (
        <div className={styles.footer}>
            <div>

            </div>
            <div className={styles.middleFooter} >
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
                    <li><button></button></li>
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
