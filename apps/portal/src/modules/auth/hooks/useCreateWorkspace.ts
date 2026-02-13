import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useCreateWorkspace = () => {
    const navigate = useNavigate();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: createWorkspace,
        onSuccess: async () => {
            navigate(PrivateRoutes.ACCOUNTS);
        },
    });

    return { isLoading, error, create: mutate }
}