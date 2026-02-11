import styles from './NewAccount.module.css';
import { Avatar, Button, Input, Select, useForm } from "@lytos/design-system";
import { useLogin } from "../../hooks/useLogin";
import type { FormEvent } from "react";
import { useSession } from "@/shared";

const NewAccount = () => {
    const { user } = useSession();
    const { login, isLogging, error } = useLogin();
    const { formState: userData, handleChange } = useForm({
        email: '',
        password: ''
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login({ email: userData.email, password: userData.password });
    }

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
            <div className={styles.content}>
                <div>
                    <h2 className={styles.title} >Introduzca los datos de su empresa</h2>

                    <form className={styles.form} onSubmit={onSubmit} >
                        <div className={styles.col} >
                            <Input name="email" label="Razón social" placeholder="tu@empresa.com" onChange={handleChange} />

                            <Select label="Número de empleados">
                                <option value="">1</option>
                                <option value="">2-5</option>
                                <option value="">6-10</option>
                                <option value="">11-25</option>
                                <option value="">26-50</option>
                                <option value="">51+</option>
                            </Select>
                        </div>

                        <Input name="email" label="URL" placeholder="tu@empresa.com" onChange={handleChange} />
                        <Input error={error?.message} name="password" label="País" placeholder="**********" type="password" togglePassword onChange={handleChange} />
                        <Input error={error?.message} name="password" label="Forma jurídica" />

                        <Button loading={isLogging} fullWidth type="submit" >Entrar</Button>
                    </form>

                    <p className={styles.policy}>Al crear una cuenta, aceptas nuestros Términos y condiciones y nuestra Política de privacidad.</p>
                </div>

            </div>

        </div>
    )
}

export default NewAccount