import { lazy, } from "react";
import type { RouteObject } from "react-router-dom";
import { authLoader } from "../loaders";
import withSuspense from "../utils/with-suspense";
import { PrivateRoutes } from "./route-paths";
import ErrorBoundary from "@/app/screens/ErrorBoundary";
import Testing from "@/app/screens/Testing";
import NewAccount from "@/modules/auth/screens/NewAccount";

const AppShell = lazy(() => import("@/app/components/Layout/AppShell"));
const Accounts = lazy(() => import("@/modules/auth/screens/Accounts"));

export const privateRoutes: RouteObject[] = [
    {
        path: PrivateRoutes.ROOT,
        loader: authLoader,
        element: withSuspense(<AppShell />),
        errorElement: <ErrorBoundary />,
        children: [
            { index: true, element: withSuspense(<Testing />) },
        ]
    },
    {
        loader: authLoader,
        errorElement: <ErrorBoundary />,
        children: [
            { path: PrivateRoutes.ACCOUNTS, element: withSuspense(<Accounts />) },
            { path: PrivateRoutes.NEW_ACCOUNT, element: withSuspense(<NewAccount />) },
        ]
    }
];
