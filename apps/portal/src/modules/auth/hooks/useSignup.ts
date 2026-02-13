import { useMutation } from "@tanstack/react-query";
import { signup } from "../services";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/shared";
import { PrivateRoutes } from "@/app/router/routes";

export const useSignup = () => {
    const navigate = useNavigate();
    const { signIn } = useSession();

    const { isPending: isLogging, mutate, error } = useMutation({
        mutationFn: signup,
        onSuccess: async (data) => {
            signIn({ user: data.user, globalToken: data.accessToken, accessExp: data.accessExp, refreshToken: data.refreshToken });
            navigate(PrivateRoutes.NEW_ACCOUNT);
        },
    });

    return { isLogging, error, signup: mutate }
}