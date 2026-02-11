import type { User } from "@lytos/contracts";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionState = {
    token: string | null;
    accessToken: string | null;
    accessExp?: string;
    refreshToken?: string;
    user: User | null;
    role?: string;
    status?: "auth" | "unauth";
    signIn: (user: User, role: string, token: string, accessExp: string, refreshToken: string) => void;
    signOut: () => void;
    isAuthenticated: () => boolean;
};

export const useSession = create<SessionState>()(
    persist(
        (set, get) => ({
            token: null,
            accessToken: null,
            user: null,
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
            signOut: () => set({ token: null, accessToken: null, user: null }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: "lytos/session",
            storage: typeof window !== "undefined"
                ? createJSONStorage(() => window.localStorage)
                : undefined,
            partialize: (s) => ({ token: s.token, accessToken: s.accessToken, user: s.user }),
            version: 1,
        }
    )
);