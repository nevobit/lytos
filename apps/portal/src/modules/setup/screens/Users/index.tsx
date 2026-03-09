import { Button, Input, Spinner, useForm } from "@lytos/design-system";
import styles from './Users.module.css';
import { useInviteUser, useInvitations, useRevokeInvitation } from '@/modules/auth/hooks';
import { useRoles } from '@/modules/roles/hooks/useRoles';
import type { Department, Invitation } from '@lytos/contracts';
import { useDepartments } from '@/modules/departments/hooks/useDepartments';

export const translateRole = (role: string): string => {
    const translations: Record<string, string> = {
        Admin: "Administrador",
        Agent: "Agente",
        Owner: "Dueño",
        Viewer: "Visualizador",
        admin: 'Administrador',
        supervisor: 'Supervisor',
        'department-supervisor': 'Supervisor de Departamento',
        agent: 'Agente',
        customer: 'Cliente',
    };

    return translations[role] || role;
};

const Users = () => {
    const { invite, isLoading: isInviting } = useInviteUser();
    const { invitations, isLoading: isLoadingList } = useInvitations();
    const { revoke, isLoading: isRevoking } = useRevokeInvitation();

    const { formState, handleChange } = useForm({
        email: '',
        role: '',
        department: ''
    });
    const { departments } = useDepartments();
    const { roles } = useRoles();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.email) return;
        const payload: { email: string; roleId?: string; departmentsIds?: string[] } = { email: formState.email };
        if (formState.role) payload.roleId = formState.role;
        if (formState.department) payload.departmentsIds = [formState.department];
        await invite(payload);
    };

    const handleRevoke = async (id: string) => {
        await revoke(id);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Invitar miembros</h2>
            <div className={styles.container}>
                <Input
                    label='Correo'
                    type="text"
                    name='email'
                    placeholder="Correo"
                    onChange={handleChange}
                />
                <select value={formState.department} name="department" id="department" onChange={handleChange}>
                    <option value="">Seleccionar un departamento</option>
                    {departments?.items?.map((department: Department) => (
                        <option value={department.id}>{department.name}</option>
                    ))}
                </select>
                <select onChange={handleChange} name="role" id="role">
                    <option value="">Seleccionar un rol</option>
                    {roles?.items?.map((role) => (
                        <option key={role.id} value={role.id}>{translateRole(role.name)}</option>
                    ))}
                </select>
                <Button loading={isInviting} onClick={handleSubmit} variant="primary">
                    Enviar invitacion
                </Button>
            </div>

            {isLoadingList ? (
                <Spinner />
            ) : (
                invitations && invitations.length > 0 && (
                    <div className={styles.listWrapper}>
                        <h3>Invitaciones pendientes</h3>
                        <ul className={styles.list}>
                                {invitations.map((inv: Invitation) => (
                                    <li key={inv.id} className={styles.item}>
                                    <span>{inv.email}</span>
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
                    </div>
                )
            )}
        </div>
    );
};

export default Users;
