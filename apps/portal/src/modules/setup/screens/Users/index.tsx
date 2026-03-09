import { Button, Input, Spinner, useForm } from "@lytos/design-system";
import styles from "./Users.module.css";
import {
    useInviteUser,
    useInvitations,
    useRevokeInvitation,
} from "@/modules/auth/hooks";
import { useRoles } from "@/modules/roles/hooks/useRoles";
import type { Department, Invitation } from "@lytos/contracts";
import { useDepartments } from "@/modules/departments/hooks/useDepartments";

export const translateRole = (role: string): string => {
    const translations: Record<string, string> = {
        Admin: "Administrador",
        Agent: "Agente",
        Owner: "Dueño",
        Viewer: "Visualizador",
        admin: "Administrador",
        supervisor: "Supervisor",
        "department-supervisor": "Supervisor de Departamento",
        agent: "Agente",
        customer: "Cliente",
    };

    return translations[role] || role;
};

const getEmailInitials = (email: string): string => {
    const base = email.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "U";
    return base.slice(0, 2).toUpperCase();
};

const Users = () => {
    const { invite, isLoading: isInviting } = useInviteUser();
    const { invitations, isLoading: isLoadingList } = useInvitations();
    const { revoke, isLoading: isRevoking } = useRevokeInvitation();
    const { departments } = useDepartments();
    const { roles } = useRoles();

    const { formState, handleChange } = useForm({
        email: "",
        role: "",
        department: "",
    });

    const pendingCount = invitations?.length ?? 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formState.email?.trim()) return;

        const payload: {
            email: string;
            roleId?: string;
            departmentsIds?: string[];
        } = {
            email: formState.email.trim(),
        };

        if (formState.role) payload.roleId = formState.role;
        if (formState.department) payload.departmentsIds = [formState.department];

        await invite(payload);
    };

    const handleRevoke = async (id: string) => {
        await revoke(id);
    };

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invitar miembros</h1>
                    <p className={styles.subtitle}>
                        Gestiona accesos al workspace, asigna roles y vincula
                        departamentos desde un solo lugar.
                    </p>
                </div>

                <div className={styles.badge}>
                    <span className={styles.badgeValue}>{pendingCount}</span>
                    <span className={styles.badgeLabel}>pendientes</span>
                </div>
            </header>

            <form className={styles.formCard} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <Input
                            label="Correo electrónico"
                            type="email"
                            name="email"
                            value={formState.email}
                            placeholder="nombre@empresa.com"
                            onChange={handleChange}
                        />
                    </div>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Departamento</span>
                        <select
                            className={styles.select}
                            value={formState.department}
                            name="department"
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            {departments?.items?.map((department: Department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Rol</span>
                        <select
                            className={styles.select}
                            value={formState.role}
                            name="role"
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            {roles?.items?.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {translateRole(role.name)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.actions}>
                        <Button
                            type="submit"
                            loading={isInviting}
                            variant="primary"
                            disabled={!formState.email?.trim()}
                        >
                            Enviar invitación
                        </Button>
                    </div>
                </div>
            </form>

            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <h2 className={styles.panelTitle}>Invitaciones pendientes</h2>
                        <p className={styles.panelSubtitle}>
                            Personas invitadas que aún no han aceptado el acceso.
                        </p>
                    </div>

                    <span className={styles.counter}>{pendingCount}</span>
                </div>

                {isLoadingList ? (
                    <div className={styles.loader}>
                        <Spinner />
                    </div>
                ) : pendingCount === 0 ? (
                    <div className={styles.empty}>
                        <p className={styles.emptyTitle}>No hay invitaciones pendientes</p>
                        <p className={styles.emptyText}>
                            Cuando invites a alguien, aparecerá aquí.
                        </p>
                    </div>
                    ) : (
                            <ul className={styles.list}>
                                {invitations.map((inv: Invitation) => (
                                    <li key={inv.id} className={styles.item}>
                                <div className={styles.itemMain}>
                                    <div className={styles.avatar}>
                                        {getEmailInitials(inv.email)}
                                    </div>

                                    <div className={styles.meta}>
                                        <span className={styles.email}>{inv.email}</span>
                                        <span className={styles.helper}>
                                            Invitación pendiente
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    size="slim"
                                    onClick={() => handleRevoke(inv.id)}
                                    disabled={isRevoking}
                                >
                                    Revocar
                                </Button>
                            </li>
                        ))}
                            </ul>
                )}
            </section>
        </section>
    );
};

export default Users;