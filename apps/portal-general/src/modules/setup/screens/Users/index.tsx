import { useState } from 'react';
import { Button, Input, Spinner } from "@lytos/design-system";
import styles from './Users.module.css';
import { useInviteUser, useInvitations, useRevokeInvitation } from '@/modules/auth/hooks';
import type { Invitation } from '@lytos/contracts';

const Users = () => {
    const [email, setEmail] = useState('');
    const { invite, isLoading: isInviting } = useInviteUser();
    const { invitations, isLoading: isLoadingList } = useInvitations();
    const { revoke, isLoading: isRevoking } = useRevokeInvitation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        await invite({ email });
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
