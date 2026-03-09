import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspace } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useDeleteWorkspace = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: deleteWorkspace,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
            navigate(PrivateRoutes.DEPARTMENTS);
        },
    });

    return { isLoading, error, deleteFn: mutate }
}