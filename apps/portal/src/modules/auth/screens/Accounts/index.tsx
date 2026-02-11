import styles from './Accounts.module.css';
import { Avatar } from "@lytos/design-system";
import { useSession } from "@/shared";
import { Link } from 'react-router-dom';
import { InvitationCard } from '../../components';
import AccountCard from '../../components/AccountCard';
import { PrivateRoutes } from '@/app/router/routes';

const Accounts = () => {
    const { user } = useSession();
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
                    <h3 className={styles.title}>Invitaciones pendientes</h3>
                    <div className={styles.invitationList} >
                        <InvitationCard id='1' name='Kosto Sas' label='Invitacion pendiente' />
                        <InvitationCard id='1' name='Kosto Sas' label='Invitacion pendiente' />
                    </div>
                </div>
                <div className={styles.accounts} >
                    <h3 className={styles.title}>Sus cuentas</h3>
                    <div className={styles.accountList} >
                        <AccountCard id='1' name='Nestor Mosquera' />
                        <AccountCard id='1' name='Diego Alten' />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Accounts