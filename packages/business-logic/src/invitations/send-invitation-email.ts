import { Resend } from "resend";
import { findWorkspaceById } from "../workspaces/find-by-id";

// simple wrapper around Resend service.  make sure RESEND_KEY is set in env.
const resendClient = new Resend(process.env.RESEND_KEY || "");

export async function sendInvitationEmail(
    workspaceId: string,
    to: string,
) {
    try {
        const ws = await findWorkspaceById(workspaceId);
        const slug = ws?.url ?? "";
        const baseDomain = process.env.BASE_DOMAIN ?? "lytos.app";
        const host = slug ? `${slug}.${baseDomain}` : baseDomain;
        const url = `https://${host}`;

        const html = htmlMessage.replace("{{url}}", url).replace("{account}", ws?.name || '')

        await resendClient.emails.send({
            from: "no-reply@lytos.app",
            to,
            subject: "Invitación a Lytos",
            html,
        });
    } catch (err) {
        // swallow the error but log it; we don't want invitation creation to fail
        console.error("sendInvitationEmail failed", err);
    }
}

const htmlMessage = ` 
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo electrónico</title>
    <style>
        /* Estilos generales */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #F5F5F7;
        }
        .container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .content {
            padding: 5px 20px;
        }
        .footer {
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2  style="font-family: sans-serif; text-align: center; font-weight: 700; font-size: 30px;" >Lytos Console</h2>
        </div>
        <div class="content">
            <h3 style="font-family: sans-serif; font-size: 14px; font-weight: 400; color: rgba(0,0,0,1);" >Hola,</h3>
            <p style="font-family: sans-serif; font-size: 14px">Te han invitado a formar parte del equipo {account} en Lytos Console.</p>
            <a href="{{url}}" style="display: inline-block; background-color: #2164D9; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: 600;">Únete al equipo</a>
            <p >Un saludo,</p>
            <p style="font-family: sans-serif; font-weight: 600; margin-top: -10px; font-size: 14px;">El equipo de Lytos Console.</p>
        </div>
        <div class="footer">
            <p>Lytos Console nunca enviará un correo electrónico solicitando que revele o verifique su contraseña, tarjeta de crédito o número de cuenta bancaria.</p>
            <p>Lytos Console, Inc,. &copy; 2026, Lytos Console. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>

`