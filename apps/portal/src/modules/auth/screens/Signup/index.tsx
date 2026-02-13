import { Link } from "react-router-dom"
import styles from './Signup.module.css';
import { Button, Input, useForm } from "@lytos/design-system";
import type { FormEvent } from "react";
import { PublicRoutes } from "@/app/router/routes";
import { useSignup } from "../../hooks";

const Signup = () => {
    const { signup, isLogging, error } = useSignup();
    const { formState: userData, handleChange } = useForm({
        name: '',
        email: '',
        password: ''
    });

    const { formState: confirm, handleChange: handleChangeConfirm, setFormState } = useForm({
        confirmPassword: '',
        confirmError: ''
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userData.password !== confirm.confirmPassword) {
            setFormState((prev) => ({
                ...prev,
                confirmError: 'Las contraseñas no coinciden',
            }));
            return;
        }
        signup({ name: userData.name, email: userData.email, password: userData.password });
    }

    return (
        <div className={styles.container} >
            <header className={styles.header} >
                <picture>
                    <h2>Lytos</h2>
                </picture>
                <Link to="/">Soporte</Link>
            </header>
            <div className={styles.content}>
                <div>
                    <h2 className={styles.title} >Bienvenido a Lytos</h2>
                    <p className={styles.copy}>Plataforma operativa para equipos y agentes</p>
                    <Button image={{ src: '/glogo.png', alt: 'Google Logo' }} fullWidth variant='monochromePlain' disabled  >Continuar con Google</Button>
                    <div className={styles.divider}>
                        <div className={styles.line} />
                        <p className={styles.or}>O</p>
                        <div className={styles.line} />
                    </div>
                    <form className={styles.form} onSubmit={onSubmit} >
                        <Input name="name" label="Nombre completo" placeholder="Jose Pelment Castro" onChange={handleChange} />
                        <Input type='email' name="email" label="Correo electronico" placeholder="tu@empresa.com" onChange={handleChange} />

                        <div className={styles.col} >
                            <Input error={error?.message} name="password" label="Contrasena" placeholder="**********" type="password" togglePassword onChange={handleChange} />
                            <Input error={confirm?.confirmError} name="confirmPassword" label="Confirmar contrasena" value={confirm.confirmPassword} placeholder="**********" type="password" togglePassword onChange={handleChangeConfirm} />
                        </div>

                        <Button loading={isLogging} fullWidth type="submit" >Entrar</Button>
                        <p className={styles.signup} > Ya tiene una cuenta? <Link to={PublicRoutes.SIGNIN} > Iniciar session</Link></p>
                    </form>

                    <p className={styles.policy}>Al iniciase sesin aceptas las politicas de seguridad y de yso de cookies esenciales.Al crear una cuenta, aceptas nuestros Términos y condiciones y nuestra Política de privacidad</p>
                </div>

            </div>
            <footer className={styles.footer}>
                <p>@ 2026 Lytos</p>
                <Link to="/">Estatus del servicio</Link>
                <Link to="/">Privacidad</Link>
            </footer>
        </div>
    )
}

export default Signup