import { Button, Input, Checkbox } from "@lytos/design-system";
import styles from './Priorities.module.css';
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { useTicketPriorities } from "@/modules/ticket-priorities/hooks/useTicketPriorities";
import { useCreateTicketPriority } from "@/modules/ticket-priorities/hooks/useCreateTicketPriority";
import { useUpdateTicketPriority } from "@/modules/ticket-priorities/hooks/useUpdateTicketPriority";
import { useDeleteTicketPriority } from "@/modules/ticket-priorities/hooks/useDeleteTicketPriority";
import type { TicketPriority, CreateTicketPripertyDto } from "@lytos/contracts";

const Priorities = () => {
    const { ticketPriorities, isLoading } = useTicketPriorities();
    const { create } = useCreateTicketPriority();
    const { update } = useUpdateTicketPriority();
    const { remove } = useDeleteTicketPriority();

    const [local, setLocal] = useState<Partial<TicketPriority>[]>([]);

    useEffect(() => {
        if (ticketPriorities) {
            setLocal(ticketPriorities.items.slice());
        }
    }, [ticketPriorities]);

    const addPriority = () => {
        setLocal([
            ...local,
            { workspaceId: '', name: '', level: 0, isDefault: false } as TicketPriority,
        ]);
    };

    const changeField = (
        idx: number,
        field: keyof CreateTicketPripertyDto,
        value: string,
    ) => {
        const updated = [...local];
        (updated[idx])[field] = value;
        setLocal(updated);
    };

    const savePriority = async (priority: TicketPriority, idx: number) => {
        try {
            if (priority.id) {
                await update(priority);
            } else {
                const payload: CreateTicketPripertyDto = {
                    workspaceId: priority.workspaceId,
                    name: priority.name,
                    level: priority.level,
                    color: priority.color,
                    isDefault: priority.isDefault,
                };
                const created = await create(payload);
                const updated = [...local];
                updated[idx] = created;
                setLocal(updated);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deletePriority = async (id: string | undefined, idx: number) => {
        if (!id) {
            const updated = [...local];
            updated.splice(idx, 1);
            setLocal(updated);
            return;
        }
        try {
            await remove(id);
            const updated = [...local];
            updated.splice(idx, 1);
            setLocal(updated);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.sectionTitle}>Prioridades</h3>
                    <p className={styles.sectionDescription}>
                        Define los niveles de prioridad de los tickets.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addPriority}
                >
                    Agregar prioridad
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando…</div>
            ) : local.length === 0 ? (
                <div className={styles.innerEmptyState}>No hay prioridades configuradas.</div>
            ) : (
                <div className={styles.ticketTypesList}>
                    {local.map((p, idx) => (
                        <details key={p.id ?? `new-${idx}`} className={styles.accordionItem}>
                            <summary className={styles.accordionSummary}>
                                <div className={styles.accordionLeft}>
                                    <CircleChevronDown className={styles.accordionIcon} size={18} />
                                    <div className={styles.accordionInputWrap}>
                                        <Input
                                            label="Nombre"
                                            type="text"
                                            value={p.name}
                                            onChange={(e) =>
                                                changeField(idx, 'name', e.target.value)
                                            }
                                            placeholder="Ej. Urgente"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="plain"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        deletePriority(p.id, idx);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </summary>

                            <div className={styles.accordionBody}>
                                <div className={styles.subTypeList}>
                                    <div className={styles.subTypeCard}>
                                        <div className={styles.subTypeHeader}>
                                            <div className={styles.subTypeInput}>
                                                <Input
                                                    label="Nivel"
                                                    type="number"
                                                    min={0}
                                                    value={String(p.level)}
                                                    onChange={(e) =>
                                                        changeField(idx, 'level', Number(e.target.value))
                                                    }
                                                    placeholder="Ej. 4"
                                                />
                                            </div>
                                            <div className={styles.subTypeInput}>
                                                <Input
                                                    label="Color"
                                                    type="color"
                                                    value={p.color || '#000000'}
                                                    onChange={(e) =>
                                                        changeField(idx, 'color', e.target.value)
                                                    }
                                                    placeholder="Color"
                                                />
                                            </div>
                                            <div className={styles.subTypeInput}>
                                                <Checkbox
                                                    checked={p.isDefault}
                                                    label="Por defecto"
                                                    onChange={(e) =>
                                                        changeField(idx, 'isDefault', e.target.checked)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.subTypeActions}>
                                            <Button
                                                type="button"
                                                size="slim"
                                                variant="primary"
                                                onClick={() => savePriority(p, idx)}
                                            >
                                                Guardar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Priorities;