import { Button, Input, Checkbox } from "@lytos/design-system";
import styles from './Statuses.module.css';
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { useTicketStatuses } from "@/modules/ticket-statuses/hooks/useTicketStatuses";
import { useCreateTicketStatus } from "@/modules/ticket-statuses/hooks/useCreateTicketStatus";
import { useUpdateTicketStatus } from "@/modules/ticket-statuses/hooks/useUpdateTicketStatus";
import { useDeleteTicketStatus } from "@/modules/ticket-statuses/hooks/useDeleteTicketStatus";
import type { TicketStatus, CreateTicketStatusDto } from "@lytos/contracts";

const Statuses = () => {
    const { ticketStatuses, isLoading } = useTicketStatuses();
    const { create } = useCreateTicketStatus();
    const { update } = useUpdateTicketStatus();
    const { remove } = useDeleteTicketStatus();

    const [local, setLocal] = useState<Partial<TicketStatus>[]>([]);

    useEffect(() => {
        if (ticketStatuses) {
            setLocal(ticketStatuses.items.slice());
        }
    }, [ticketStatuses]);

    const addStatus = () => {
        setLocal([
            ...local,
            { workspaceId: '', name: '', description: '', isDefault: false } as TicketStatus,
        ]);
    };

    const changeField = <K extends keyof CreateTicketStatusDto>(
        idx: number,
        field: K,
        value: CreateTicketStatusDto[K],
    ) => {
        const updated = [...local];
        (updated[idx])[field] = value;
        setLocal(updated);
    };

    const saveStatus = async (status: Partial<TicketStatus>, idx: number) => {
        try {
            if (status.id) {
                await update(status);
            } else {
                const payload: Partial<CreateTicketStatusDto> = {
                    workspaceId: status.workspaceId,
                    name: status.name,
                    description: status.description,
                    isDefault: status.isDefault,
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

    const deleteStatus = async (id: string | undefined, idx: number) => {
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
                    <h3 className={styles.sectionTitle}>Estados</h3>
                    <p className={styles.sectionDescription}>
                        Gestiona los estados posibles de un ticket.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addStatus}
                >
                    Agregar estado
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando…</div>
            ) : local.length === 0 ? (
                <div className={styles.innerEmptyState}>No hay estados configurados.</div>
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
                                            placeholder="Nombre"
                                        />
                                    </div>
                                </div>
                                <div className={styles.accordionActions}>
                                    <Button
                                        type="button"
                                        size="slim"
                                        variant="plain"
                                        icon={<Trash2 size={14} />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteStatus(p.id, idx);
                                        }}
                                    />
                                </div>
                            </summary>
                            <div className={styles.accordionBody}>
                                <Input
                                    label="Descripción"
                                    value={p.description}
                                    onChange={(e) =>
                                        changeField(idx, 'description', e.target.value)
                                    }
                                    placeholder="Descripción (opcional)"
                                />
                                <Checkbox
                                    label="Estado predeterminado"
                                    checked={p.isDefault}
                                    onChange={(e) =>
                                        changeField(idx, 'isDefault', e.target.checked)
                                    }
                                />
                                <div className={styles.accordionActions}>
                                    <Button
                                        size="slim"
                                        variant="primary"
                                        onClick={() => saveStatus(p, idx)}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Statuses;
