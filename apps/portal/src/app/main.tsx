import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@lytos/design-system/css/web.css";
import { ToastProvider, Modal, buildAppShell } from "@lytos/design-system";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { CurrencyProvider, PersistedQueryProvider } from "./providers";

import { PWAEvents } from "./pwa/PWAEvents";
import Application from "./Application";

const AppShell = buildAppShell(
  [
    [Modal, {}],
    [ToastProvider, {}],
    [CurrencyProvider, {}],
    [PersistedQueryProvider, {}],
  ],
  [
    [ReactQueryDevtools, { initialIsOpen: true }],
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
