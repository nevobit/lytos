import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Button, Input, useForm } from "@lytos/design-system";
import { useLogin } from "../../hooks/useLogin";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    "expired-callback"?: () => void;
                    "error-callback"?: () => void;
                    theme?: "light" | "dark" | "auto";
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

const Login = () => {
    const { login, isLogging, error } = useLogin();
    const { loginWithGoogle } = useGoogleLogin();

    const { formState: userData, handleChange } = useForm({
        email: "",
        password: "",
    });

    const captchaContainerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);

    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaReady, setCaptchaReady] = useState(false);

    useEffect(() => {
        const scriptId = "cf-turnstile-script";

        const renderCaptcha = () => {
            if (!window.turnstile || !captchaContainerRef.current || widgetIdRef.current) return;

            widgetIdRef.current = window.turnstile.render(captchaContainerRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                theme: "auto",
                callback: (token: string) => {
                    setCaptchaToken(token);
                },
                "expired-callback": () => {
                    setCaptchaToken("");
                },
                "error-callback": () => {
                    setCaptchaToken("");
                },
            });

            setCaptchaReady(true);
        };

        const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

        if (existingScript) {
            if (window.turnstile) renderCaptcha();
            else {
                existingScript.addEventListener("load", renderCaptcha);
                return () => existingScript.removeEventListener("load", renderCaptcha);
            }
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = renderCaptcha;

        document.body.appendChild(script);

        return () => {
            script.onload = null;
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!captchaToken) return;

        login({
            email: userData.email,
            password: userData.password,
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <picture>
                    <img className={styles.logo} src="/images/logo.png" alt="Lytos Logo" />
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
                                if (!credentialResponse.credential || !captchaToken) return;

                                loginWithGoogle(
                                    credentialResponse.credential
                                );
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

                        <div className={styles.captchaBlock}>
                            <div ref={captchaContainerRef} />
                        </div>

                        <Link className={styles.forgot} to="/">
                            ¿Olvidaste tu contraseña?
                        </Link>


                        <Button
                            loading={isLogging}
                            fullWidth
                            type="submit"
                            disabled={!captchaReady || !captchaToken}
                        >
                            Entrar
                        </Button>
                    </form>

                    <p className={styles.policy}>
                        Al iniciar sesión aceptas las políticas de seguridad y el uso de cookies esenciales.
                    </p>
                </div>
            </div>

            <footer className={styles.footer}>
                <p>© 2026 Lytos</p>
                <Link to="/">Estatus del servicio</Link>
                <Link to="/">Privacidad</Link>
            </footer>
        </div>
    );
};

export default Login;