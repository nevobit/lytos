import Link from 'next/link';
import styles from './Platform.module.css';

const Platform = () => {
    return (
        <div className={styles.container} >
            <div>
                <div className={styles.kickerRow}>
                    <div className={styles.kickerDot} />
                    <div className={styles.kicker}>Plataforma Operativa</div>
                </div>
                <div className={styles.header} >
                    <h2 className={styles.title} >Potencia tu Operación de Soporte</h2>
                    <Link className={styles.ctaBtn} href='/' >Explorar la plataforma →</Link>
                </div>

            </div>

            <div className={styles.content}>
                <div className={styles.cards}>
                    <details className={styles.item} >
                        <summary className={styles.itemHeader} >Gestión de Tickets en Tiempo Real</summary>
                        <p className={styles.itemBody} >Visualiza, asigna y resuelve tickets desde una bandeja unificada.
                            Control total del estado, prioridad y responsable.</p>
                    </details>
                    <details className={styles.item}>
                        <summary className={styles.itemHeader}>Conversaciones Omnicanal</summary>
                        <p className={styles.itemBody} >Unifica email, webchat y WhatsApp en un solo hilo por ticket.
                            Historial completo, notas internas y contexto siempre visible.</p>
                    </details>
                    <details className={styles.item}>
                        <summary className={styles.itemHeader}>Métricas y Rendimiento del Equipo</summary>
                        <p className={styles.itemBody} >Supervisa tiempos de respuesta, resolución y carga por agente.
                            Detecta cuellos de botella antes de que escalen.</p>
                    </details>
                    <details className={styles.item}>
                        <summary className={styles.itemHeader}>Roles y Permisos Avanzados</summary>
                        <p className={styles.itemBody} >Controla qué puede ver y hacer cada miembro del equipo.
                            Seguridad y gobernanza por workspace.</p>
                    </details>
                    <details className={styles.item}>
                        <summary className={styles.itemHeader}>Integraciones y API</summary>
                        <p className={styles.itemBody} >Conecta Lytos con tu stack actual.
                            Webhooks, API REST y automatizaciones personalizadas.</p>
                    </details>
                </div>
                <div className={styles.right}>

                    <div className={styles.panel}>

                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Resumen Operativo</span>
                            <span className={styles.panelPill}>Últimos 7 días</span>
                        </div>

                        <div className={styles.panelBody}>
                            <div className={styles.bigNumber}>124 Tickets Activos</div>
                            <div className={styles.smallNote}>
                                Tiempo promedio de respuesta: 1h 12m
                            </div>

                            <div className={styles.bars}>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                            </div>
                        </div>

                        <div className={styles.subCard}>
                            <div className={styles.subHeader}>
                                <span className={styles.subTitle}>Carga por Departamento</span>
                                <span className={styles.badgeUp}>↑ 18%</span>
                            </div>

                            <div className={styles.subBody}>

                                <div className={styles.progress}>
                                    <div className={styles.progressFill}></div>
                                </div>

                                <div className={styles.legend}>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot}></span>
                                        Soporte Técnico
                                    </div>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot}></span>
                                        Ventas
                                    </div>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot}></span>
                                        Facturación
                                    </div>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot}></span>
                                        Atención General
                                    </div>
                                </div>

                            </div>

                            <div className={styles.panelFooter}>
                                <button className={styles.footerBtn}>
                                    Ver detalles
                                    <span className={styles.footerBtnIcon}>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Platform