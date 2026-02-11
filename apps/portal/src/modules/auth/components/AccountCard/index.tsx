import { Avatar } from '@lytos/design-system';
import styles from './AccountCard.module.css';

interface Props {
    id: string;
    name: string;
}

const AccountCard = ({ id, name }: Props) => {

    return (
        <div className={styles.card} >
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