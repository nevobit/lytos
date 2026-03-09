import { Button, Input, Checkbox } from "@lytos/design-system";
import styles from './Categories.module.css';
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { useTicketCategories } from "@/modules/ticket-categories/hooks/useTicketCategories";
import { useCreateTicketCategory } from "@/modules/ticket-categories/hooks/useCreateTicketCategory";
import { useUpdateTicketCategory } from "@/modules/ticket-categories/hooks/useUpdateTicketCategory";
import { useDeleteTicketCategory } from "@/modules/ticket-categories/hooks/useDeleteTicketCategory";
import type { TicketCategory, CreateTicketCategoryDto } from "@lytos/contracts";

const Categories = () => {
    const { ticketCategories, isLoading } = useTicketCategories();
    const { create } = useCreateTicketCategory();
    const { update } = useUpdateTicketCategory();
    const { remove } = useDeleteTicketCategory();

    const [local, setLocal] = useState<Partial<TicketCategory>[]>([]);

    useEffect(() => {
        if (ticketCategories) {
            setLocal(ticketCategories.items.slice());
        }
    }, [ticketCategories]);

    const addCategory = () => {
        setLocal([
            ...local,
            { workspaceId: '', name: '', isDefault: false } as TicketCategory,
        ]);
    };

    const changeField = <K extends keyof CreateTicketCategoryDto>(
        idx: number,
        field: K,
        value: CreateTicketCategoryDto[K],
    ) => {
        const updated = [...local];
        updated[idx][field] = value;
        setLocal(updated);
    };

    const saveCategory = async (cat: Partial<TicketCategory>, idx: number) => {
        try {
            if (cat.id) {
                await update(cat);
            } else {
                const payload: Partial<CreateTicketCategoryDto> = {
                    workspaceId: cat.workspaceId,
                    name: cat.name,
                    description: cat.description,
                    isDefault: cat.isDefault,
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

    const deleteCategory = async (id: string | undefined, idx: number) => {
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
                    <h3 className={styles.sectionTitle}>Categorías</h3>
                    <p className={styles.sectionDescription}>
                        Gestiona las categorías de tickets.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addCategory}
                >
                    Agregar categoría
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando…</div>
            ) : local.length === 0 ? (
                <div className={styles.innerEmptyState}>No hay categorías configuradas.</div>
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
                                        deleteCategory(p.id, idx);
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
                                                onClick={() => saveCategory(p, idx)}
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

export default Categories;