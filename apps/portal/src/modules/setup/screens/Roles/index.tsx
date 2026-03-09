import { Button, Input, Checkbox, Select } from "@lytos/design-system";
import styles from './Roles.module.css';
import { CircleChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { useRoles } from "@/modules/roles/hooks/useRoles";
import { useCreateRole } from "@/modules/roles/hooks/useCreateRole";
import { useUpdateRole } from "@/modules/roles/hooks/useUpdateRole";
import { useDeleteRole } from "@/modules/roles/hooks/useDeleteRole";
import type { Role, CreateRoleDto } from "@lytos/contracts";


// permissions are represented as `<resource>.<action>` strings internally but we
// keep a more user friendly structure while editing.
type PermissionEntry = { resource: string; action: string };

const PERMISSION_DEFINITIONS: Record<
    string,
    { label: string; actions: { label: string; value: string }[] }
> = {
    workspace: { label: "Espacio de trabajo", actions: [{ label: "Gestionar", value: "manage" }] },
    tickets: {
        label: "Tickets",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Crear", value: "create" },
            { label: "Responder", value: "reply" },
            { label: "Actualizar", value: "update" },
            { label: "Asignar", value: "assign" },
        ],
    },
    contacts: {
        label: "Contactos",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Crear", value: "create" },
        ],
    },
    members: {
        label: "Miembros",
        actions: [
            { label: "Invitar", value: "invite" },
            { label: "Actualizar", value: "update" },
        ],
    },
    departments: {
        label: "Departamentos",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    "ticket-types": {
        label: "Tipos de ticket",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    "ticket-priorities": {
        label: "Prioridades",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    "ticket-categories": {
        label: "Categorías",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    "ticket-statuses": {
        label: "Estados",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    "scalation-rules": {
        label: "Reglas de escalamiento",
        actions: [
            { label: "Leer", value: "read" },
            { label: "Gestionar", value: "manage" },
        ],
    },
    invitations: { label: "Invitaciones", actions: [{ label: "Gestionar", value: "manage" }] },
    roles: { label: "Roles", actions: [{ label: "Gestionar", value: "manage" }] },
};

const parsePermissions = (perms?: string[]): PermissionEntry[] =>
    (perms || []).map((p) => {
        const [resource, action] = p.split('.');
        return { resource, action };
    });

const serializePermissions = (entries: PermissionEntry[]) =>
    entries
        .filter((e) => e.resource && e.action)
        .map((e) => `${e.resource}.${e.action}`);

const Roles = () => {
    const { roles, isLoading } = useRoles();
    const { create } = useCreateRole();
    const { update } = useUpdateRole();
    const { remove } = useDeleteRole();

    const [local, setLocal] = useState<Partial<Role & { permissionEntries?: PermissionEntry[] }>[]>([]);

    useEffect(() => {
        if (roles) {
            setLocal(
                roles.items.map((r): Partial<Role & { permissionEntries?: PermissionEntry[] }> => ({
                    ...r,
                    permissionEntries: parsePermissions(r.permissions),
                }))
            );
        }
    }, [roles]);

    const addRole = () => {
        setLocal([
            ...local,
            { workspaceId: '', name: '', description: '', permissions: [], scopes: {} as unknown, isSystem: false, permissionEntries: [] } as Partial<Role & { permissionEntries?: PermissionEntry[] }>,
        ]);
    };

    const changeField = <K extends keyof CreateRoleDto>(
        idx: number,
        field: K,
        value: CreateRoleDto[K],
    ) => {
        const updated = [...local];
        (updated[idx])[field] = value;
        setLocal(updated);
    };

    const changePermission = (
        roleIdx: number,
        permIdx: number,
        field: keyof PermissionEntry,
        value: string
    ) => {
        const updated = [...local];
        const role = updated[roleIdx];
        const entries = role.permissionEntries ?? parsePermissions(role.permissions);
        entries[permIdx] = { ...entries[permIdx], [field]: value };
        role.permissionEntries = entries;
        role.permissions = serializePermissions(entries);
        setLocal(updated);
    };

    const addPermission = (roleIdx: number) => {
        const updated = [...local];
        const role = updated[roleIdx];
        const entries = role.permissionEntries ?? parsePermissions(role.permissions);
        entries.push({ resource: '', action: '' });
        role.permissionEntries = entries;
        role.permissions = serializePermissions(entries);
        setLocal(updated);
    };

    const removePermission = (roleIdx: number, permIdx: number) => {
        const updated = [...local];
        const role = updated[roleIdx];
        const entries = role.permissionEntries ?? parsePermissions(role.permissions);
        entries.splice(permIdx, 1);
        role.permissionEntries = entries;
        role.permissions = serializePermissions(entries);
        setLocal(updated);
    };

    const saveRole = async (role: Partial<Role>, idx: number) => {
        try {
            if (role.id) {
                await update(role);
            } else {
                const payload: Partial<CreateRoleDto> = {
                    workspaceId: role.workspaceId,
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions,
                    scopes: role.scopes,
                    isSystem: role.isSystem,
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

    const deleteRoleItem = async (id: string | undefined, idx: number) => {
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
                    <h3 className={styles.sectionTitle}>Roles</h3>
                    <p className={styles.sectionDescription}>
                        Gestiona los roles de tu workspace.
                    </p>
                </div>

                <Button
                    size="slim"
                    icon={<Plus size={16} />}
                    variant="primary"
                    onClick={addRole}
                >
                    Agregar rol
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando…</div>
            ) : local.length === 0 ? (
                <div className={styles.innerEmptyState}>No hay roles configurados.</div>
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
                                            deleteRoleItem(p.id, idx);
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
                                <div>
                                    <label className="ds-label">Permisos</label>
                                    {p.permissionEntries?.map((entry: PermissionEntry, peIdx: number) => (
                                        <div key={peIdx} className={styles.permissionRow}>
                                            <Select
                                                label="Recurso"
                                                value={entry.resource}
                                                onChange={(e) =>
                                                    changePermission(idx, peIdx, 'resource',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">--</option>
                                                {Object.entries(PERMISSION_DEFINITIONS).map(
                                                    ([res, def]) => (
                                                        <option key={res} value={res}>
                                                            {def.label}
                                                        </option>
                                                    )
                                                )}
                                            </Select>
                                            <Select
                                                label="Acción"
                                                value={entry.action}
                                                onChange={(e) =>
                                                    changePermission(idx, peIdx, 'action',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">--</option>
                                                {(PERMISSION_DEFINITIONS[entry.resource]
                                                    ?.actions || []).map((a) => (
                                                        <option key={a.value} value={a.value}>
                                                            {a.label}
                                                        </option>
                                                    ))}
                                            </Select>
                                            <Button
                                                size="slim"
                                                variant="plain"
                                                icon={<Trash2 size={14} />}
                                                onClick={() => removePermission(idx, peIdx)}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        size="slim"
                                        variant="secondary"
                                        onClick={() => addPermission(idx)}
                                    >
                                        Añadir permiso
                                    </Button>
                                </div>
                                <Checkbox
                                    label="Sistema"
                                    checked={p.isSystem}
                                    onChange={(e) =>
                                        changeField(idx, 'isSystem', e.target.checked)
                                    }
                                />
                                <div className={styles.accordionActions}>
                                    <Button
                                        size="slim"
                                        variant="primary"
                                        onClick={() => saveRole(p, idx)}
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

export default Roles;
