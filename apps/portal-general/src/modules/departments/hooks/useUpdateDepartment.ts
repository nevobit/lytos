import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useUpdateDepartment = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateDepartment,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
            navigate(PrivateRoutes.DEPARTMENTS);
        },
    });

    return { isLoading, error, update: mutate }
}