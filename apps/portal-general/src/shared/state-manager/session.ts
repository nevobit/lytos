import type { User, Workspace } from "@lytos/contracts";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionState = {
    globalToken: string | null;     
    token: string | null;          
    refreshToken: string | null;

    accessExp?: string;

    user: User | null;

    workspace: Partial<Workspace> | null;
    activeMembershipId?: string;
    roleId?: string;

    status?: "auth" | "unauth";

    signIn: (p: {
        user: User;
        globalToken: string;
        accessExp?: string;
        refreshToken: string;
    }) => void;

    signOut: () => void;
    changeAccount: () => void;


    setWorkspaceContext: (p: {
        workspaceToken: string;
        membershipId: string;
        workspace: { id: string; name: string };
    }) => void;

    isAuthenticated: () => boolean;
};

export const useSession = create<SessionState>()(
    persist(
        (set, get) => ({
            token: null,
            globalToken: null,
            refreshToken: null,
            user: null,
            workspace: null,

            signIn: ({ user, globalToken, accessExp, refreshToken }) => {
                set({
                    user,
                    globalToken,
                    token: globalToken, 
                    accessExp,
                    refreshToken,
                    status: "auth",
                });
            },

            setWorkspaceContext: ({ workspaceToken, membershipId, workspace }) => {
                set({
                    token: workspaceToken, // ahora token workspace
                    activeMembershipId: membershipId,
                    workspace,
                });
            },

            signOut: () =>
                set({
                    token: null,
                    globalToken: null,
                    refreshToken: null,
                    workspace: null,
                    user: null,
                    status: "unauth",
                    activeMembershipId: undefined,
                }),
            changeAccount: () => set({
                workspace: null
            }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: "lytos/session",
            storage: typeof window !== "undefined"
                ? createJSONStorage(() => window.localStorage)
                : undefined,
            partialize: (s) => ({
                token: s.token,
                globalToken: s.globalToken,
                refreshToken: s.refreshToken,
                workspace: s.workspace,
                user: s.user,
                activeMembershipId: s.activeMembershipId,
            }), version: 1,
        }
    )
);