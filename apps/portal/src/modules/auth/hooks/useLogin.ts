import { useMutation } from "@tanstack/react-query";
import { login } from "../services";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/shared";
import { PrivateRoutes } from "@/app/router/routes";

export const useLogin = () => {
    const navigate = useNavigate();
    const { signIn } = useSession();

    const { isPending: isLogging, mutate, error } = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            signIn(data.user, data.role, data.accessToken, data.accessExp, data.refreshToken);
            navigate(PrivateRoutes.ACCOUNTS);
        },
    });

    return { isLogging, error, login: mutate }
}