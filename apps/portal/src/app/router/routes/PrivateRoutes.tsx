import { lazy, } from "react";
import type { RouteObject } from "react-router-dom";
import { authLoader } from "../loaders";
import withSuspense from "../utils/with-suspense";
import { PrivateRoutes } from "./route-paths";
import ErrorBoundary from "@/app/screens/ErrorBoundary";
import Testing from "@/app/screens/Testing";
import Accounts from "@/modules/auth/screens/Accounts";
import NewAccount from "@/modules/auth/screens/NewAccount";

const AppShell = lazy(() => import("@/app/components/Layout/AppShell"));

export const privateRoutes: RouteObject[] = [
    {
        path: PrivateRoutes.ROOT,
        loader: authLoader,
        element: withSuspense(<AppShell />),
        errorElement: <ErrorBoundary />,
        children: [
            { index: true, element: withSuspense(<Testing />) },
            // { path: PrivateRoutes.CONTACTS.replace, element: withSuspense(<Contacts />) },
            // { path: PrivateRoutes.PRODUCTS.replace, element: withSuspense(<Products />) },
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
