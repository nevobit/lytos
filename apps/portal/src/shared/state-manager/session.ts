import type { User, Workspace } from "@lytos/contracts";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionState = {
    token: string | null;
    accessExp?: string;
    refreshToken?: string;
    user: User | null;
    role?: string;
    workspace: Partial<Workspace> | null;
    status?: "auth" | "unauth";
    signIn: (user: User, role: string, token: string, accessExp: string, refreshToken: string) => void;
    signOut: () => void;
    singWorkspace: (workspaceId: string, workspaceName: string) => void;
    isAuthenticated: () => boolean;
};

export const useSession = create<SessionState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            workspace: null,
            signIn: (user, role, token, accessExp, refreshToken) => {
                set({
                    user,
                    role,
                    token,
                    accessExp,
                    refreshToken,
                    status: "auth",
                });
            },
            singWorkspace: (workspaceId, name) => {
                set({
                    workspace: { name, id: workspaceId },
                })
            },
            signOut: () => set({ token: null, workspace: null, user: null }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: "lytos/session",
            storage: typeof window !== "undefined"
                ? createJSONStorage(() => window.localStorage)
                : undefined,
            partialize: (s) => ({ token: s.token, workspace: s.workspace, user: s.user }),
            version: 1,
        }
    )
);