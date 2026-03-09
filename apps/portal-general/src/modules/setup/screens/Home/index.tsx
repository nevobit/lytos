import { useSession } from '@/shared';
import styles from './Home.module.css';
import { useDepartments } from '@/modules/departments/hooks/useDepartments';
import { Card } from '../../components';


const HomeSetup = () => {
    const { user } = useSession();
    const { departments } = useDepartments();

    const steps = [
        {
            name: 'parameters',
            status: true
        },
        {
            name: 'departments',
            status: departments?.count > 0
        },
        {
            name: 'parameters',
            status: false
        }
    ]

    return (
        <div className={styles.content_container}>

            <form className={styles.form_layout}>
                <div className={styles.welcome} >
                    <h3>Hola, {user?.name}</h3>
                    <p>Esperamos que Lytos te ayude a gestionar y entender mejor las solicitudes de tus clientes, y estaremos encantados de recibir comentarios para seguir mejorando.</p>
                </div>
                <div className={styles.form_layout_underlay} />
                <div className={styles.form_layout_underlay_bottom} />

                <h3 className={styles.title}>Empezar nunca había sido tan fácil</h3>
                <p className={styles.copy}>
                    Completa todos los pasos a continuación para activar tu cuenta y
                    potenciar la gestión de tu negocio.
                </p>

                <div className={styles.steps} >
                    {steps.map((step) => (
                        <div className={`${styles.step} ${step.status && styles.active}`} ></div>
                    ))}
                </div>

                <div className={styles.box}>
                    <Card
                        url="/settings/overview"
                        title="Personalizar parametros"
                        copy="Personaliza los valores de tus tipos de ticket, estados, categorías, prioridades, severidades y reglas de escalamiento."
                        icon='FileSliders'
                    />
                    <Card
                        url="/departments"
                        title="Configurar departamentos"
                        copy="Añade la información imprescindible para gestionar tus departamentos."
                        icon='Building'
                    />
                    <Card
                        url="/settings/users"
                        title="Invita a tu equipo"
                        copy="Invita y configura los permisos e información de los diferentes usuariso pertenecientes a la organizacion."
                        icon='UserPlus'
                    />

                    {/* <SetupCard
            url="/admin/resolutors/groups"
            title="Configurar grupos resolutores"
            copy="Añade la información imprescindible para gestionar tus grupos resolutores."
          /> */}
                    {/* <SetupCard
            url=""
            title="Cofigurar departamentos"
            copy="Añade la información imprescindible para gestionar tus departamentos."
          /> */}
                    {/* <SetupCard
            url=""
            title="Cofigurar departamentos"
            copy="Añade la información imprescindible para gestionar tus departamentos."
          />
          <SetupCard
            url=""
            title="Cofigurar departamentos"
            copy="Añade la información imprescindible para gestionar tus departamentos."
          /> */}
                </div>
            </form>
        </div>
    )
}

export default HomeSetup