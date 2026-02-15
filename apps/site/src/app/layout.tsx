import type { ReactNode } from "react";
import type { Metadata } from "next";

import "@lytos/design-system/css/web.css";
import { AppProviders } from "@/providers/app-providers";
import { Header } from "@/shared/components/header";
import { Manrope } from "next/font/google";
import Pricing from "@/modules/home/Pricing";
import { Footer } from "@/shared/components/footer";
import Platform from "@/modules/home/Platform";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata: Metadata = {
    verification: {
        google: ''
    },
    metadataBase: new URL('https://lytos.com.app'),
    title: {
        default: 'Lytos - Plataforma de Operaciones con Clientes',
        template: '%s | Lytos'
    },
    description: 'desc',
    applicationName: 'Lytos',
    keywords: [''],
    authors: [{ name: 'Nevobit', url: 'https://nevobit.co' }],
    creator: 'Nevobit Software',
    publisher: 'Nevobit Software',
    alternates: {
        canonical: '/',
        languages: {
            'es-ES': '/es-ES',
            'de-DE': '/de-DE',
        }
    },
    openGraph: {
        title: 'Repo',
        description: '...',
        url: 'https://repo.com.co',
        siteName: 'Repo',
        type: 'website',
        locale: 'es-ES',
    },
    twitter: {
        title: 'Repo',
        description: '...',
        creator: '@nevobitsoftware',
        site: 'Repo',
        card: 'summary_large_image',
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es" suppressHydrationWarning className={manrope.variable} >
            <body  >
                <AppProviders>
                    <Header />
                    {children}
                    <Platform />
                    <Pricing />
                    <Footer />
                </AppProviders>
            </body>
        </html>
    );
}
