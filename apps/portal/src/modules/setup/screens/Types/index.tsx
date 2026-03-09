import { Button, Input, Checkbox } from "@lytos/design-system";
import styles from './Types.module.css';
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { useTicketTypes } from "@/modules/ticket-types/hooks/useTicketTypes";
import { useCreateTicketType } from "@/modules/ticket-types/hooks/useCreateTicketType";
import { useUpdateTicketType } from "@/modules/ticket-types/hooks/useUpdateTicketType";
import { useDeleteTicketType } from "@/modules/ticket-types/hooks/useDeleteTicketType";
import type { TicketType, CreateTicketTypeDto } from "@lytos/contracts";

const Types = () => {
    const { ticketTypes, isLoading } = useTicketTypes();
    const { create } = useCreateTicketType();
    const { update } = useUpdateTicketType();
    const { remove } = useDeleteTicketType();

    const [local, setLocal] = useState<Partial<TicketType>[]>([]);

    useEffect(() => {
        if (ticketTypes) {
            setLocal(ticketTypes.items.slice());
        }
    }, [ticketTypes]);

    const addType = () => {
        setLocal([
            ...local,
            { workspaceId: '', name: '', isDefault: false } as TicketType,
        ]);
    };

    const changeField = (
        idx: number,
        field: keyof CreateTicketTypeDto,
        value: undefined,
    ) => {
        const readOnlyFields = ['id', 'createdAt', 'deletedAt'];
        if (readOnlyFields.includes(field)) {
            return;
        }
        const updated = [...local];
        (updated[idx])[field] = value;
        setLocal(updated);
    };

    const saveType = async (t: TicketType, idx: number) => {
        try {
            if (t.id) {
                await update(t);
            } else {
                const payload: CreateTicketTypeDto = {
                    workspaceId: t.workspaceId,
                    name: t.name,
                    description: t.description,
                    isDefault: t.isDefault,
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

    const deleteType = async (id: string | undefined, idx: number) => {
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
                    <h3 className={styles.sectionTitle}>Tipos</h3>
                    <p className={styles.sectionDescription}>
                        Gestiona los tipos de tickets.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addType}
                >
                    Agregar tipo
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando…</div>
            ) : local.length === 0 ? (
                <div className={styles.innerEmptyState}>No hay tipos configurados.</div>
            ) : (
                <div className={styles.ticketTypesList}>
                    {local.map((p, idx) => (
                        <details key={p.id ?? `new-${idx}`} className={styles.accordionItem}>
                            <summary className={styles.accordionSummary}>
                                <div className={styles.accordionLeft}>
                                    <CircleChevronDown className={styles.accordionIcon} size={18} />
                                    <div className={styles.accordionInputWrap}>
                                        <Input
                                            type="text"
                                            value={p.name}
                                            onChange={(e) =>
                                                changeField(idx, 'name', e.target.value)
                                            }
                                            placeholder="Nombre"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="plain"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        deleteType(p.id, idx);
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
                                                    type="text"
                                                    value={p.description || ''}
                                                    onChange={(e) =>
                                                        changeField(idx, 'description', e.target.value)
                                                    }
                                                    placeholder="Descripción (opcional)"
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
                                                onClick={() => saveType(p, idx)}
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

export default Types;
