import styles from './Card.module.css';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from '@lytos/design-system';

interface Props {
    url: string;
    icon?: string;
    title: string;
    copy: string;
}

const Card = ({ url, title, copy, icon }: Props) => {
    const maybeIcon = icon ? Icons[icon as keyof typeof Icons] : null;
    const IconComponent = (typeof maybeIcon === 'function' && 'displayName' in maybeIcon)
        ? (maybeIcon as Icons.LucideIcon)
        : null;

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.icon} >
                {IconComponent && (
                    <IconComponent size={20} strokeWidth="1.5px" color="rgba(0, 0, 0, 1)" />
                )}
            </div>
            <div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.copy}>{copy}</p>
            </div>
            <Button onClick={() => navigate(url)} variant="primary">
                Configurar
            </Button>
        </div>
    );
};

export default Card