import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Button, Input, useForm } from "@lytos/design-system";
import { useLogin } from "../../hooks/useLogin";
import { useState, type FormEvent } from "react";
import { PublicRoutes } from "@/app/router/routes";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { GoogleReCaptchaCheckbox } from '@google-recaptcha/react';

const Login = () => {
    const { login, isLogging, error } = useLogin();
    const { loginWithGoogle } = useGoogleLogin();

    const [token, setToken] = useState('');
    const { formState: userData, handleChange } = useForm({
        email: "",
        password: "",
    });

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await login({
            email: userData.email,
            password: userData.password,
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <picture>
                    <img className={styles.logo} src="/images/logo.png" alt="Lytos" />
                </picture>
                <Link to="/">Soporte</Link>
            </header>

            <div className={styles.content}>
                <div>
                    <h2 className={styles.title}>Bienvenido a Lytos</h2>
                    <p className={styles.copy}>Plataforma operativa para equipos y agentes</p>

                    <div className={styles.googleWrapper}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                if (!credentialResponse.credential) return;
                                loginWithGoogle(credentialResponse.credential);
                            }}
                            onError={() => {
                                console.error("Google Login Failed");
                            }}
                            text="continue_with"
                            theme="outline"
                            size="large"
                            shape="rectangular"
                        />
                    </div>

                    <div className={styles.divider}>
                        <div className={styles.line} />
                        <p className={styles.or}>O</p>
                        <div className={styles.line} />
                    </div>

                    <form className={styles.form} onSubmit={onSubmit}>
                        <Input
                            name="email"
                            label="Correo electrónico"
                            placeholder="tu@empresa.com"
                            onChange={handleChange}
                        />

                        <Input
                            error={error?.message}
                            name="password"
                            label="Contraseña"
                            placeholder="**********"
                            type="password"
                            togglePassword
                            onChange={handleChange}
                        />

                        <Link className={styles.forgot} to="/">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <GoogleReCaptchaCheckbox onChange={(token) => setToken(token)} />
                        <Button
                            loading={isLogging}
                            fullWidth
                            type="submit"
                            disabled={token.length <= 100 || isLogging}
                        >
                            Entrar
                        </Button>

                        <p className={styles.signup}>
                            ¿Aún no tienes cuenta?{" "}
                            <Link to={PublicRoutes.SIGNUP}>Crea una cuenta</Link>
                        </p>
                    </form>

                    <p className={styles.policy}>
                        Al iniciar sesión aceptas las políticas de seguridad y el uso de cookies esenciales.
                    </p>
                </div>
            </div>

            <footer className={styles.footer}>
                <p>@ 2026 Lytos</p>
                <Link to="/">Estatus del servicio</Link>
                <Link to="/">Privacidad</Link>
            </footer>
        </div>
    );
};

export default Login;