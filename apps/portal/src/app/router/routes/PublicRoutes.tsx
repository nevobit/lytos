import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { guestLoader } from "../loaders";
import { PublicRoutes } from "./route-paths";
import withSuspense from "../utils/with-suspense";
import ErrorBoundary from "@/app/screens/ErrorBoundary";
import Testing from "@/app/screens/Testing";
import { AppShell } from "@/app/components/Layout";

const Signin = lazy(() => import("@/modules/auth/screens/Login"));

export const publicRoutes: RouteObject[] = [
    {
        path: PublicRoutes.SIGNIN,
        loader: guestLoader,
        element: withSuspense(<Signin />),
        errorElement: <ErrorBoundary />,
    },
    {
        path: PublicRoutes.TESTING,
        loader: guestLoader,
        element: withSuspense(<AppShell />),
        errorElement: <ErrorBoundary />,
        children: [
            { index: true, element: withSuspense(<Testing />) },
            // { path: PrivateRoutes.CONTACTS.replace, element: withSuspense(<Contacts />) },
            // { path: PrivateRoutes.PRODUCTS.replace, element: withSuspense(<Products />) },
        ]
    },
];
