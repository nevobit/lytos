import { lazy, } from "react";
import type { RouteObject } from "react-router-dom";
import { authLoader } from "../loaders";
import withSuspense from "../utils/with-suspense";
import { PrivateRoutes } from "./route-paths";
import ErrorBoundary from "@/app/screens/ErrorBoundary";
import NewAccount from "@/modules/auth/screens/NewAccount";
import Departments from "@/modules/departments/screens/List";
import Tickets from "@/modules/tickets/screens/List";
import HomeDashboard from "@/modules/dashboard/screens/Home";
import HomeSetup from "@/modules/setup/screens/Home";
import Settings from "@/modules/setup/screens/Settings";
import Cases from "@/modules/setup/screens/Cases";
import Customers from "@/modules/customers/screens/List";
import Priorities from "@/modules/setup/screens/Priorities"; import Categories from "@/modules/setup/screens/Categories"; import Types from "@/modules/setup/screens/Types"; import Overview from "@/modules/setup/screens/Overview";
import Billing from "@/modules/setup/screens/Billing";

const AppShell = lazy(() => import("@/app/components/Layout/AppShell"));
const Accounts = lazy(() => import("@/modules/auth/screens/Accounts"));

export const privateRoutes: RouteObject[] = [
    {
        path: PrivateRoutes.ROOT,
        loader: authLoader,
        element: withSuspense(<AppShell />),
        errorElement: <ErrorBoundary />,
        children: [
            { index: true, element: withSuspense(<HomeDashboard />) },
            { path: PrivateRoutes.SETUP, element: withSuspense(<HomeSetup />) },
            { path: PrivateRoutes.DEPARTMENTS, element: withSuspense(<Departments />) },
            { path: PrivateRoutes.TICKETS, element: withSuspense(<Tickets />) },
            { path: PrivateRoutes.CUSTOMERS, element: withSuspense(<Customers />) },
            {
                path: PrivateRoutes.SETTINGS,
                element: withSuspense(<Settings />),
                children: [
                    { path: 'overview', element: withSuspense(<Overview />) },
                    { path: 'priorities', element: withSuspense(<Priorities />) },
                    { path: 'categories', element: withSuspense(<Categories />) },
                    { path: 'types', element: withSuspense(<Types />) },
                    { path: 'cases', element: withSuspense(<Cases />) },
                    { path: 'billing', element: withSuspense(<Billing />) },
                ]
            },
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
