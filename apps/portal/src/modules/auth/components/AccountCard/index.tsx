import { Avatar } from '@lytos/design-system';
import styles from './AccountCard.module.css';
import { useSession } from '@/shared';
import { useNavigate } from 'react-router-dom';

interface Props {
    id: string;
    name: string;
}

const AccountCard = ({ id, name }: Props) => {
    const { singWorkspace } = useSession();
    const navigate = useNavigate();

    const selectAccount = () => {
        singWorkspace(id, name);
        navigate('/')
    }
    return (
        <div className={styles.card} onClick={selectAccount} >
            <div className={styles.information} >
                <Avatar shape='rounded' nonce={id} name={name} />
                <div>
                    <h3 className={styles.title}>{name}</h3>
                </div>
            </div>
        </div>
    )
}

export default AccountCard