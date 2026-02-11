import { Avatar, Button } from '@lytos/design-system';
import styles from './InvitationCard.module.css';

interface Props {
    id: string;
    name: string;
    label: string;

}

const InvitationCard = ({ id, name, label }: Props) => {
    return (
        <div className={styles.card} >
            <div className={styles.information} >
                <Avatar shape='rounded' nonce={id} name={name} />
                <div>
                    <h3 className={styles.title}>{name}</h3>
                    <p className={styles.label}>{label}</p>
                </div>
            </div>
            <div className={styles.actions} >
                <Button>Aceptar</Button>
            </div>
        </div>
    )
}

export default InvitationCard