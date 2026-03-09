import styles from './NewAccount.module.css';
import { Avatar, Button, Input, Select, useForm } from "@lytos/design-system";
import type { FormEvent } from "react";
import { useSession } from "@/shared";
import type { CreateWorkspaceDto } from '@lytos/contracts';
import { useCreateWorkspace } from '../../hooks';

const NewAccount = () => {
    const { user } = useSession();
    const { isLoading, create } = useCreateWorkspace();
    const { formState: workspace, handleChange } = useForm<CreateWorkspaceDto>({
        name: '',
        employees: '',
        url: '',
        country: 'chile',
        legalForm: '',
        locale: '',
        plan: { name: 'free', seatsLimit: 3, channelsEnabled: ['email', 'webchat'] },
    });


    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        create({ ...workspace, });
    }

    return (
        <div className={styles.container} >
            <header className={styles.header} >
                <picture>
                    <img className={styles.logo} src="/images/logo.png" />
                </picture>
                <div className={styles.userInfo} >
                    <Avatar size='sm' name={user?.name} color='var(--ds-brand-purple)' />
                    <div>
                        <h4>{user?.name}</h4>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </header>
            <div className={styles.content}>
                <div>
                    <h2 className={styles.title} >Introduzca los datos de su empresa</h2>

                    <form className={styles.form} onSubmit={onSubmit} >
                        <div className={styles.col} >
                            <Input name="name" label="Razón social" placeholder="tu@empresa.com" onChange={handleChange} />

                            <Select name='employees' onChange={handleChange} label="Número de empleados">
                                <option value="">Seleccionar</option>
                                <option value="1">1</option>
                                <option value="2-5">2-5</option>
                                <option value="6-10">6-10</option>
                                <option value="11-25">11-25</option>
                                <option value="26-5">26-50</option>
                                <option value="51+">51+</option>
                            </Select>
                        </div>

                        <Input name="url" label="URL" suffix=".lytos.app" value={workspace.url}
                            placeholder={workspace.url} onChange={handleChange} />
                        <Select name='country' label="País" onChange={handleChange} >
                            <option value="chile">Chile</option>
                            <option value="colombia">Colombia</option>
                            <option value="argentina">Argentina</option>
                            <option value="peru">Peru</option>
                        </Select>
                        <Input name="legalForm" label="Forma jurídica" onChange={handleChange} />

                        <Button loading={isLoading} fullWidth type="submit" >Entrar</Button>
                    </form>

                    <p className={styles.policy}>Al crear una cuenta, aceptas nuestros Términos y condiciones y nuestra Política de privacidad.</p>
                </div>

            </div>

        </div>
    )
}

export default NewAccount

// const generateTenantUrl = (companyName: string) => {
//     return (
//         companyName
//             .toLowerCase()
//             .replace(/spa|sas|scc|scs|ltda|s\.a\.?/gi, '')
//             .trim()
//             .replace(/\s+/g, '-')
//             .replace(/[^a-z0-9-]/g, '')
//             .replace(/-+/g, '-')
//             .replace(/-$/, '') + '.lytos.app'
//     );
// };
