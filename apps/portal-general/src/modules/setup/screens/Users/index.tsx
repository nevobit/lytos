import { useState } from 'react';
import { Button, Input, Spinner } from "@lytos/design-system";
import styles from './Users.module.css';
import { useInviteUser, useInvitations, useRevokeInvitation } from '@/modules/auth/hooks';
import { useRoles } from '@/modules/roles/hooks/useRoles';
import { useDepartments } from '@/modules/departments/hooks/useDepartments';
import type { Invitation, Department } from '@lytos/contracts';

const Users = () => {
    const [email, setEmail] = useState('');
    const { invite, isLoading: isInviting } = useInviteUser();
    const { invitations, isLoading: isLoadingList } = useInvitations();
    const { revoke, isLoading: isRevoking } = useRevokeInvitation();
    const { roles } = useRoles();
    const { departments } = useDepartments();
    const [formState, setFormState] = useState({ role: '', department: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const payload: { email: string; roleId?: string; departmentsIds?: string[] } = { email };
        if (formState.role) payload.roleId = formState.role;
        if (formState.department) payload.departmentsIds = [formState.department];
        await invite(payload);
        setEmail('');
    };

    const handleRevoke = async (id: string) => {
        await revoke(id);
    };

    return (
        <div className={styles.container}>
            <h2>Invitar miembros</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    name="email"
                    type="email"
                    label="Correo electrónico"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <select
                    value={formState.department}
                    onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                >
                    <option value="">Seleccionar departamento</option>
                    {departments?.items?.map((d: Department) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <select
                    value={formState.role}
                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                >
                    <option value="">Seleccionar rol</option>
                    {roles?.items?.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
                <Button type="submit" disabled={!email || isInviting}>
                    {isInviting ? 'Enviando...' : 'Enviar invitación'}
                </Button>
            </form>

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
