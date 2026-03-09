import { useNavigate } from "react-router-dom";
import { useSession } from "@/shared";
import { useMutation } from "@tanstack/react-query";
import { loginGoogle } from "../services";
import { PrivateRoutes } from "@/app/router/routes";

export const useGoogleLogin = () => {
    const navigate = useNavigate();
    const { signIn } = useSession();

    const { isPending: isLoggingGoogle, mutate, error } = useMutation({
        mutationFn: loginGoogle,
        onSuccess: async (data) => {
            signIn({
                user: data.user,
                globalToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
            navigate(PrivateRoutes.ACCOUNTS);
        }
    })
    return {
        loginWithGoogle: mutate,
        isLoggingGoogle,
        error,
    };
};