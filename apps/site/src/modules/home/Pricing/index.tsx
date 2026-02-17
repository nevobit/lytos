import React from 'react'
import styles from './Pricing.module.css';
import { CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

const Pricing = () => {
    return (
        <div className={styles.container}>
            <h2>Explora nuestros planes</h2>
            <p>Gestiona tickets, conversaciones y equipos desde una sola consola.
                Lytos centraliza la operación de soporte de tu organización.</p>


            <div className={styles.cards} >
                <div className={styles.card}>
                    <Star />
                    <h3><span>$</span>9.99<span>(por agente)</span></h3>
                    <Link href='/' >Comenzar ahora</Link>
                    <p>Ideal para equipos pequeños que están empezando.</p>
                    <div className={styles.include}>
                        <p>Incluye:</p>
                        <ul>
                            <li><CheckCircle /> Gestión de tickets</li>
                            <li><CheckCircle /> Conversaciones por email y webchat</li>
                            <li><CheckCircle /> Bandeja unificada</li>
                            <li><CheckCircle /> 1 workspace</li>
                            <li><CheckCircle /> Hasta 3 agentes</li>
                        </ul>

                    </div>
                </div>
                <div className={styles.card}>
                    <Star />
                    <h3><span>$</span>19.99<span>(por agente)</span></h3>
                    <Link href='/' >Comenzar ahora</Link>
                    <p>Para equipos en crecimiento que necesitan control.</p>
                    <div className={styles.include}>
                        <p>Incluye:</p>
                        <ul>
                            <li><CheckCircle /> Todo lo del plan Starter</li>
                            <li><CheckCircle /> Multiples departamentos</li>
                            <li><CheckCircle /> Asignación automática de tickets</li>
                            <li><CheckCircle /> Notas internas</li>
                            <li><CheckCircle /> Historial completo de conversaciones</li>
                            <li><CheckCircle /> Métricas básicas de rendimiento</li>
                            <li><CheckCircle /> Hasta 10 agentes</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.card}>
                    <Star />
                    <h3><span>$</span>29.99<span>(por agente)</span></h3>
                    <Link href='/' >Comenzar ahora</Link>
                    <p>Para operaciones maduras que necesitan control total.</p>
                    <div className={styles.include} >
                        <p>Incluye:</p>
                        <ul>
                            <li><CheckCircle /> Todo lo del plan Growth</li>
                            <li><CheckCircle /> Roles y permisos avanzados</li>
                            <li><CheckCircle /> SLA y prioridades</li>
                            <li><CheckCircle /> Reportes avanzados</li>
                            <li><CheckCircle /> Integraciones externas</li>
                            <li><CheckCircle /> API access</li>
                            <li><CheckCircle /> Agentes ilimitados</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing