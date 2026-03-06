import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useDeleteDepartment = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: deleteDepartment,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
            navigate(PrivateRoutes.DEPARTMENTS);
        },
    });

    return { isLoading, error, deleteFn: mutate }
}