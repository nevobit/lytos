import styles from './Settings.module.css';
import { Tabs } from '../../components';

const Settings = () => {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <h4 className={styles.eyebrow} >Configuración</h4>
                    <div className={styles.title}>Centro de configuración</div>
                    <p className={styles.copy} >Administre la configuración y preferencias de su cuenta</p>
                </div>
            </div>
            <Tabs />
        </div>
    )
}

export default Settings