import styles from './Accounts.module.css';
import { Avatar, Spinner } from "@lytos/design-system";
import { useSession } from "@/shared";
import { Link } from 'react-router-dom';
import { InvitationCard } from '../../components';
import AccountCard from '../../components/AccountCard';
import { PrivateRoutes } from '@/app/router/routes';
import { useWorkspaces } from '../../hooks';


const Accounts = () => {
    const { user } = useSession();
    const { isLoading, workspaces } = useWorkspaces();

    if (isLoading) return <Spinner />
    return (
        <div className={styles.container} >
            <header className={styles.header} >
                <picture>
                    <h2>Lytos</h2>
                </picture>
                <div className={styles.userInfo} >
                    <Avatar size='sm' name={user?.name} color='var(--ds-brand-purple)' />
                    <div>
                        <h4>{user?.name}</h4>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </header>
            <div className={styles.content} >
                <h2>Bienvenido, {user?.name.split(' ')[0]}</h2>
                <p className={styles.copy}>Elije una cuenta o <Link to={PrivateRoutes.NEW_ACCOUNT} >crear una nueva</Link></p>

                <div className={styles.invitations} >
                    <h3 className={styles.title}>Invitaciones pendientes (2)</h3>
                    <div className={styles.invitationList} >
                        <InvitationCard id='1' name='Revoluc Inc' label='Invitacion pendiente' />
                        <InvitationCard id='1' name='Kosto Sas' label='Invitacion pendiente' />
                    </div>
                </div>
                <div className={styles.accounts} >
                    <h3 className={styles.title}>Sus cuentas ({workspaces?.memberships.length})</h3>
                    <div className={styles.accountList} >
                        {workspaces?.memberships?.map((workspace: { membershipId: string, workspaceId: string, workspaceName: string }) => (
                            <AccountCard key={workspace.workspaceId} membershipId={workspace.membershipId} workspaceId={workspace.workspaceId} name={workspace.workspaceName} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Accounts