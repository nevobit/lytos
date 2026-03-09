import { Avatar, Menus } from '@lytos/design-system';
import styles from './AccountCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useDeleteWorkspace, useSwitchWorkspace } from '../../hooks';
import { MoreVertical } from 'lucide-react';

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
        await switchWorkspace({ membershipId, workspaceId });
        navigate("/");
    };

    const { deleteFn } = useDeleteWorkspace();


    const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        deleteFn(workspaceId);
    };


    return (
        <div className={styles.card} >
            <button className={styles.cardButton}
                type='button' disabled={isLoading} onClick={selectAccount}  >
            <div className={styles.information} >
                <Avatar shape='rounded' nonce={workspaceId} name={name} />
                <div>
                    <h3 className={styles.title}>{name}</h3>
                </div>
            </div>
            </button>
            <Menus>
                <Menus.Menu>
                    <Menus.Toggle className={styles.options} id={`workspace-actions-${workspaceId}`} >
                        <MoreVertical size={18} color='#000' />
                    </Menus.Toggle>
                    <Menus.List id={`workspace-actions-${workspaceId}`} >
                        <Menus.Item id='delete-${workspaceId}' onClick={handleOptionsClick} >
                            Eliminar
                        </Menus.Item>
                    </Menus.List>
                </Menus.Menu>
            </Menus>

        </div>

    )
}

export default AccountCard