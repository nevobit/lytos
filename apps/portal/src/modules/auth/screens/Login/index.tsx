import { Link } from "react-router-dom"
import styles from './Login.module.css';
import { Button, Input, useForm } from "@lytos/design-system";
import { useLogin } from "../../hooks/useLogin";
import type { FormEvent } from "react";
import { PublicRoutes } from "@/app/router/routes";

const Login = () => {
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
                        <Input name="email" label="Correo electronico" placeholder="tu@empresa.com" onChange={handleChange} />
                        <Input error={error?.message} name="password" label="Contrasena" placeholder="**********" type="password" togglePassword onChange={handleChange} />
                        <Link className={styles.forgot} to='/'>Olvidaste tu contrasena?</Link>
                        <Button loading={isLogging} fullWidth type="submit" >Entrar</Button>
                        <p className={styles.signup} > Aun no tiene cuenta? <Link to={PublicRoutes.SIGNUP} > Crea una cuenta</Link></p>
                    </form>

                    <p className={styles.policy}>Al iniciase sesin aceptas las politicas de seguridad y de yso de cookies esenciales.</p>
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

export default Login