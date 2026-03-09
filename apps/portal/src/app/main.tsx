import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@lytos/design-system/css/web.css";
import { ToastProvider, Modal, buildAppShell } from "@lytos/design-system";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { CurrencyProvider, PersistedQueryProvider } from "./providers";

import { PWAEvents } from "./pwa/PWAEvents";
import Application from "./Application";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleReCaptchaProvider } from '@google-recaptcha/react';

const AppShell = buildAppShell(
  [
    [Modal, {}],
    [ToastProvider, {}],
    [CurrencyProvider, {}],
    [PersistedQueryProvider, {}],
    [GoogleOAuthProvider, { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID }],
    [GoogleReCaptchaProvider, {
      type: 'v2-checkbox',
      siteKey: "6LcKGYQsAAAAAHqX7Me6MCcnHxkuythlYm_MLuiv",
    }]
  ],
  [
    [ReactQueryDevtools, { initialIsOpen: false }],
  ]
);
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

root.render(
  <StrictMode>
    <AppShell>
      <Application />
      <PWAEvents />
    </AppShell>
  </StrictMode>
);
