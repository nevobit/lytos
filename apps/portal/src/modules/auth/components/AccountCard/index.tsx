import { Avatar } from '@lytos/design-system';
import styles from './AccountCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useSwitchWorkspace } from '../../hooks';

interface Props {
    membershipId: string;
    workspaceId: string;
    name: string;
}
const AccountCard = ({
    membershipId,
    workspaceId,
    name,
}: Props) => {
    const navigate = useNavigate();
    const { switchWorkspace, isLoading } = useSwitchWorkspace();

    const selectAccount = async () => {
        await switchWorkspace(membershipId);
        navigate("/");
    };
    return (
        <button type='button' disabled={isLoading} className={styles.card} onClick={selectAccount}  >
            <div className={styles.information} >
                <Avatar shape='rounded' nonce={workspaceId} name={name} />
                <div>
                    <h3 className={styles.title}>{name}</h3>
                </div>
            </div>
        </button>
    )
}

export default AccountCard