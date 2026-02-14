import styles from './Page.module.css';
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

export default async function HomePage() {
    return (
        <main className={styles.container}>
            <div className={styles.heroBadge}>
                <span className={styles.dot} aria-hidden="true"></span>
                <span className={styles.heroBadgeText}><strong>Novedad</strong> · Descubre el motor inteligente de soporte</span>
            </div>

            <h1 className={styles.heroTitle}>
                Operaciones más Inteligentes.<br />
                Resultados más Rápidos.
            </h1>

            <p className={styles.heroSubtitle}>
                Centraliza conversaciones, tickets y equipos en una sola plataforma.
                Convierte cada interacción en datos accionables para tu organización.
            </p>


            <div className={styles.heroCta}>
                <Link href="/signup">
                    Comenzar ahora <MoveRight strokeWidth="1px" />
                </Link>
                <Link href="#demo">
                    <span className="ly-play" aria-hidden="true">▶</span> Ver demostración
                </Link>
            </div>
            <picture className={styles.heroImage} >
                <Image src='/banner.png' alt="Banner Lytos" width={1280} height={900} />
            </picture>
        </main>
    );
}
