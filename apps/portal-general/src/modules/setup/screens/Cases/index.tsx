import { Button, Input, Select, Checkbox } from "@lytos/design-system";
import styles from "./Cases.module.css";
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useScalationRules } from "@/modules/scalation-rules/hooks/useScalationRules";
import { useCreateScalationRule } from "@/modules/scalation-rules/hooks/useCreateScalationRule";
import { useUpdateScalationRule } from "@/modules/scalation-rules/hooks/useUpdateScalationRule";
import { useDeleteScalationRule } from "@/modules/scalation-rules/hooks/useDeleteScalationRule";
import { useDepartments } from "@/modules/departments/hooks/useDepartments";
import { useUsers } from "@/modules/auth/hooks";

import type {
    ScalationRule,
    RuleCondition,
    RuleAction,
} from "@lytos/contracts";

type SelectOption = {
    label: string;
    value: string;
};

type BasicUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
};

type BasicDepartment = {
    id: string;
    name?: string | null;
};

const triggerOptions: SelectOption[] = [
    { label: "Incumplimiento de SLA", value: "sla_breach" },
    { label: "Tiempo en estado", value: "time_in_status" },
];

const actionOptions: SelectOption[] = [
    { label: "Notificar", value: "notify" },
    { label: "Reasignar", value: "reassign" },
    { label: "Cambiar prioridad", value: "set_priority" },
    { label: "Agregar etiqueta", value: "add_tag" },
];

const conditionFieldOptions: SelectOption[] = [
    { label: "Estado", value: "status" },
    { label: "Prioridad", value: "priority" },
    { label: "Agente asignado", value: "assignedUserId" },
    { label: "Departamento", value: "departmentId" },
    { label: "Etiqueta", value: "tag" },
    { label: "Horas en estado", value: "timeInStatusHours" },
];

const conditionOperatorOptions: SelectOption[] = [
    { label: "Es igual a", value: "eq" },
    { label: "Es diferente de", value: "neq" },
    { label: "Contiene", value: "contains" },
    { label: "No contiene", value: "not_contains" },
    { label: "Mayor que", value: "gt" },
    { label: "Mayor o igual que", value: "gte" },
    { label: "Menor que", value: "lt" },
    { label: "Menor o igual que", value: "lte" },
    { label: "Está en", value: "in" },
    { label: "No está en", value: "not_in" },
];

const priorityOptions: SelectOption[] = [
    { label: "Baja", value: "low" },
    { label: "Media", value: "medium" },
    { label: "Alta", value: "high" },
    { label: "Crítica", value: "critical" },
];

const statusOptions: SelectOption[] = [
    { label: "Abierto", value: "open" },
    { label: "En progreso", value: "in_progress" },
    { label: "Pendiente", value: "pending" },
    { label: "Resuelto", value: "resolved" },
    { label: "Cerrado", value: "closed" },
];

const extractItems = <T,>(source: unknown): T[] => {
    if (Array.isArray(source)) return source as T[];

    if (
        source &&
        typeof source === "object" &&
        "items" in source &&
        Array.isArray((source as { items?: unknown[] }).items)
    ) {
        return (source as { items: T[] }).items;
    }

    return [];
};

const getSelectValue = (input: unknown): string => {
    if (typeof input === "string") return input;
    if (typeof input === "number") return String(input);

    if (
        input &&
        typeof input === "object" &&
        "target" in input &&
        (input as { target?: { value?: unknown } }).target?.value != null
    ) {
        return String((input as { target: { value: unknown } }).target.value);
    }

    if (input && typeof input === "object" && "value" in input) {
        const raw = (input as { value?: unknown }).value;
        return raw == null ? "" : String(raw);
    }

    return "";
};

const getUserLabel = (user: BasicUser): string => {
    const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.name?.trim();

    return fullName || user.email || user.id;
};

const renderSelectOptions = (options: SelectOption[]) =>
    options.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
    ));

const createEmptyRule = (): Partial<ScalationRule> =>
({
    workspaceId: "",
    departmentId: undefined,
    name: "",
    enabled: true,
    trigger: "sla_breach",
    conditions: [],
    actions: [],
} as Partial<ScalationRule>);

const createEmptyCondition = (): RuleCondition => ({
    field: "status",
    op: "eq",
    value: "",
});

const createEmptyAction = (): RuleAction => ({
    type: "notify",
    value: "",
});

const Cases = () => {
    const { scalationRules, isLoading } = useScalationRules();
    const { users } = useUsers();
    const { departments } = useDepartments();

    const { create } = useCreateScalationRule();
    const { update } = useUpdateScalationRule();
    const { remove } = useDeleteScalationRule();

    const [localRules, setLocalRules] = useState<Partial<ScalationRule>[]>([]);

    useEffect(() => {
        if (scalationRules?.items) {
            setLocalRules(scalationRules.items.slice());
        }
    }, [scalationRules]);

    const userOptions = useMemo<SelectOption[]>(() => {
        const items = extractItems<BasicUser>(users);

        return [
            { label: "Selecciona un agente", value: "" },
            ...items.map((user) => ({
                label: getUserLabel(user),
                value: user.id,
            })),
        ];
    }, [users]);

    const departmentOptions = useMemo<SelectOption[]>(() => {
        const items = extractItems<BasicDepartment>(departments);

        return [
            { label: "Todos los departamentos", value: "" },
            ...items.map((department) => ({
                label: department.name?.trim() || department.id,
                value: department.id,
            })),
        ];
    }, [departments]);

    const addRule = () => {
        setLocalRules((prev) => [...prev, createEmptyRule()]);
    };

    const changeField = <K extends keyof Partial<ScalationRule>>(
        idx: number,
        field: K,
        value: Partial<ScalationRule>[K]
    ) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === idx ? { ...rule, [field]: value } : rule
            )
        );
    };

    const addCondition = (ruleIndex: number) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        conditions: [...rule.conditions || [], createEmptyCondition()],
                    }
                    : rule
            )
        );
    };

    const updateCondition = (
        ruleIndex: number,
        conditionIndex: number,
        field: keyof RuleCondition,
        value: RuleCondition[keyof RuleCondition]
    ) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        conditions: rule?.conditions?.map((condition, i) =>
                            i === conditionIndex
                                ? { ...condition, [field]: value }
                                : condition
                        ),
                    }
                    : rule
            )
        );
    };

    const removeCondition = (ruleIndex: number, conditionIndex: number) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        conditions: rule.conditions?.filter((_, i) => i !== conditionIndex),
                    }
                    : rule
            )
        );
    };

    const addAction = (ruleIndex: number) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        actions: [...rule.actions || [], createEmptyAction()],
                    }
                    : rule
            )
        );
    };

    const updateAction = (
        ruleIndex: number,
        actionIndex: number,
        field: keyof RuleAction,
        value: RuleAction[keyof RuleAction]
    ) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        actions: rule.actions?.map((action, i) =>
                            i === actionIndex ? { ...action, [field]: value } : action
                        ),
                    }
                    : rule
            )
        );
    };

    const changeActionType = (
        ruleIndex: number,
        actionIndex: number,
        nextType: RuleAction["type"]
    ) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        actions: rule.actions?.map((action, i) =>
                            i === actionIndex
                                ? { ...action, type: nextType, value: "" }
                                : action
                        ),
                    }
                    : rule
            )
        );
    };

    const removeAction = (ruleIndex: number, actionIndex: number) => {
        setLocalRules((prev) =>
            prev.map((rule, index) =>
                index === ruleIndex
                    ? {
                        ...rule,
                        actions: rule.actions?.filter((_, i) => i !== actionIndex),
                    }
                    : rule
            )
        );
    };

    const saveRule = async (rule: Partial<ScalationRule>, idx: number) => {
        try {
            if (rule.id) {
                await update(rule);
                return;
            }

            const payload: Partial<ScalationRule> = {
                workspaceId: rule.workspaceId,
                departmentId: rule.departmentId,
                name: rule.name,
                enabled: rule.enabled,
                trigger: rule.trigger,
                conditions: rule.conditions,
                actions: rule.actions,
            };

            const created = await create(payload);

            if (created) {
                setLocalRules((prev) =>
                    prev.map((item, index) => (index === idx ? created : item))
                );
            }
        } catch {
            return;
        }
    };

    const deleteRule = async (id: string | undefined, idx: number) => {
        if (!id) {
            setLocalRules((prev) => prev.filter((_, index) => index !== idx));
            return;
        }

        try {
            await remove(id);
            setLocalRules((prev) => prev.filter((_, index) => index !== idx));
        } catch {
            return
        }
    };

    const renderConditionValueInput = (
        ruleIndex: number,
        conditionIndex: number,
        condition: RuleCondition
    ) => {
        if (condition.field === "departmentId") {
            return (
                <Select
                    value={String(condition.value ?? "")}
                    onChange={(next) =>
                        updateCondition(
                            ruleIndex,
                            conditionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(departmentOptions)}
                </Select>
            );
        }

        if (condition.field === "assignedUserId") {
            return (
                <Select
                    value={String(condition.value ?? "")}
                    onChange={(next) =>
                        updateCondition(
                            ruleIndex,
                            conditionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(userOptions)}
                </Select>
            );
        }

        if (condition.field === "priority") {
            return (
                <Select
                    value={String(condition.value ?? "")}
                    onChange={(next) =>
                        updateCondition(
                            ruleIndex,
                            conditionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(priorityOptions)}
                </Select>
            );
        }

        if (condition.field === "status") {
            return (
                <Select
                    value={String(condition.value ?? "")}
                    onChange={(next) =>
                        updateCondition(
                            ruleIndex,
                            conditionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(statusOptions)}
                </Select>
            );
        }

        return (
            <Input
                type="text"
                value={String(condition.value ?? "")}
                onChange={(e) =>
                    updateCondition(ruleIndex, conditionIndex, "value", e.target.value)
                }
                placeholder="Valor"
            />
        );
    };

    const renderActionValueInput = (
        ruleIndex: number,
        actionIndex: number,
        action: RuleAction
    ) => {
        if (action.type === "notify" || action.type === "reassign") {
            return (
                <Select
                    value={String(action.value ?? "")}
                    onChange={(next) =>
                        updateAction(
                            ruleIndex,
                            actionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(userOptions)}
                </Select>
            );
        }

        if (action.type === "set_priority") {
            return (
                <Select
                    value={String(action.value ?? "")}
                    onChange={(next) =>
                        updateAction(
                            ruleIndex,
                            actionIndex,
                            "value",
                            getSelectValue(next)
                        )
                    }
                >
                    {renderSelectOptions(priorityOptions)}
                </Select>
            );
        }

        return (
            <Input
                type="text"
                value={String(action.value ?? "")}
                onChange={(e) =>
                    updateAction(ruleIndex, actionIndex, "value", e.target.value)
                }
                placeholder="Valor de la acción"
            />
        );
    };

    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.sectionTitle}>Reglas de escalamiento</h3>
                    <p className={styles.sectionDescription}>
                        Define cuándo y cómo se escalan los casos.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addRule}
                >
                    Agregar regla
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando reglas…</div>
            ) : localRules.length === 0 ? (
                <div className={styles.innerEmptyState}>
                    No hay reglas configuradas.
                </div>
            ) : (
                <div className={styles.ticketTypesList}>
                    {localRules.map((rule, idx) => (
                        <details key={rule.id ?? `new-${idx}`} className={styles.accordionItem}>
                            <summary className={styles.accordionSummary}>
                                <div className={styles.accordionLeft}>
                                    <CircleChevronDown
                                        className={styles.accordionIcon}
                                        size={18}
                                    />
                                    <div className={styles.accordionInputWrap}>
                                        <Input
                                            type="text"
                                            value={rule.name}
                                            onChange={(e) =>
                                                changeField(idx, "name", e.target.value)
                                            }
                                            placeholder="Nombre de la regla"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="plain"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        deleteRule(rule.id, idx);
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
                                                <Select
                                                    value={rule.trigger}
                                                    onChange={(next) =>
                                                        changeField(
                                                            idx,
                                                            "trigger",
                                                            getSelectValue(next) as ScalationRule["trigger"]
                                                        )
                                                    }
                                                >
                                                    {renderSelectOptions(triggerOptions)}
                                                </Select>
                                            </div>

                                            <div className={styles.subTypeInput}>
                                                <Checkbox
                                                    checked={rule.enabled}
                                                    label="Habilitada"
                                                    onChange={(e) =>
                                                        changeField(
                                                            idx,
                                                            "enabled",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className={styles.subTypeInput}>
                                                <Select
                                                    value={rule.departmentId ?? ""}
                                                    onChange={(next) =>
                                                        changeField(
                                                            idx,
                                                            "departmentId",
                                                            getSelectValue(next) || undefined
                                                        )
                                                    }
                                                >
                                                    {renderSelectOptions(departmentOptions)}
                                                </Select>
                                            </div>
                                        </div>

                                        <div className={styles.escalationList}>
                                            <div className={styles.subTypeHeader}>
                                                <strong>Condiciones</strong>
                                                <Button
                                                    type="button"
                                                    size="slim"
                                                    variant="secondary"
                                                    onClick={() => addCondition(idx)}
                                                >
                                                    + Condición
                                                </Button>
                                            </div>

                                            {rule.conditions?.length === 0 ? (
                                                <div className={styles.innerEmptyState}>
                                                    No hay condiciones.
                                                </div>
                                            ) : (
                                                rule.conditions?.map((condition, conditionIndex) => (
                                                    <div
                                                        key={`condition-${idx}-${conditionIndex}`}
                                                        className={styles.escalationRow}
                                                    >
                                                        <div className={styles.escalationGrid}>
                                                            <Select
                                                                value={condition.field}
                                                                onChange={(next) =>
                                                                    updateCondition(
                                                                        idx,
                                                                        conditionIndex,
                                                                        "field",
                                                                        getSelectValue(next)
                                                                    )
                                                                }
                                                            >
                                                                {renderSelectOptions(conditionFieldOptions)}
                                                            </Select>

                                                            <Select
                                                                value={condition.op}
                                                                onChange={(next) =>
                                                                    updateCondition(
                                                                        idx,
                                                                        conditionIndex,
                                                                        "op",
                                                                        getSelectValue(next)
                                                                    )
                                                                }
                                                            >
                                                                {renderSelectOptions(conditionOperatorOptions)}
                                                            </Select>

                                                            {renderConditionValueInput(
                                                                idx,
                                                                conditionIndex,
                                                                condition
                                                            )}
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="plain"
                                                            onClick={() =>
                                                                removeCondition(
                                                                    idx,
                                                                    conditionIndex
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className={styles.escalationList}>
                                            <div className={styles.subTypeHeader}>
                                                <strong>Acciones</strong>
                                                <Button
                                                    type="button"
                                                    size="slim"
                                                    variant="secondary"
                                                    onClick={() => addAction(idx)}
                                                >
                                                    + Acción
                                                </Button>
                                            </div>

                                            {rule.actions?.length === 0 ? (
                                                <div className={styles.innerEmptyState}>
                                                    No hay acciones.
                                                </div>
                                            ) : (
                                                rule.actions?.map((action, actionIndex) => (
                                                    <div
                                                        key={`action-${idx}-${actionIndex}`}
                                                        className={styles.escalationRow}
                                                    >
                                                        <div className={styles.escalationGrid}>
                                                            <Select
                                                                value={action.type}
                                                                onChange={(next) =>
                                                                    changeActionType(
                                                                        idx,
                                                                        actionIndex,
                                                                        getSelectValue(next) as RuleAction["type"]
                                                                    )
                                                                }
                                                            >
                                                                {renderSelectOptions(actionOptions)}
                                                            </Select>

                                                            {renderActionValueInput(
                                                                idx,
                                                                actionIndex,
                                                                action
                                                            )}
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="plain"
                                                            onClick={() =>
                                                                removeAction(idx, actionIndex)
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className={styles.subTypeActions}>
                                            <Button
                                                type="button"
                                                size="slim"
                                                variant="primary"
                                                onClick={() => saveRule(rule, idx)}
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

export default Cases;